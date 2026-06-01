import type { AiGuidanceResult, Earth911LookupResult, ItemProfile } from './types';

const AI_BASE_URL = process.env.EXPO_PUBLIC_AI_BASE_URL?.trim() ?? '';
const AI_API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY?.trim() ?? '';
const AI_MODEL = process.env.EXPO_PUBLIC_AI_MODEL?.trim() ?? 'gpt-4.1-mini';

function buildPrompt(profile: ItemProfile, earth911: Earth911LookupResult, itemText: string, barcode?: string) {
  const locationSummary = earth911.locations
    .slice(0, 3)
    .map((location) => `${location.name} — ${location.address}`)
    .join('\n');

  return `You are a recycling coach for a mobile app.

Item: ${itemText}
Category: ${profile.label}
Barcode: ${barcode ?? 'n/a'}
Official guidance: ${profile.disposition}
Special handling: ${profile.specialHandling}
Safety notes: ${profile.safetyNotes.join(' | ')}
Earth911 location summary:\n${locationSummary || 'No nearby locations returned.'}

Return concise JSON with keys: headline, summary, nextAction, safetyNotes (array of 3 short items), reasoning.`;
}

function fallbackGuidance(profile: ItemProfile, earth911: Earth911LookupResult): AiGuidanceResult {
  const location = earth911.locations[0];
  const nextAction = location
    ? `Use ${location.name} for drop-off${location.address ? ` at ${location.address}` : ''}.`
    : profile.specialHandling;

  return {
    source: 'local',
    headline: `${profile.emoji} ${profile.label} guidance`,
    summary: profile.disposition,
    nextAction,
    safetyNotes: profile.safetyNotes,
    reasoning: 'Built from the local recycling catalog and the current Earth911 lookup results.',
    notice: earth911.notice,
  };
}

function parseAssistantResponse(content: string, profile: ItemProfile, earth911: Earth911LookupResult): AiGuidanceResult {
  try {
    const parsed = JSON.parse(content) as Partial<AiGuidanceResult> & { safetyNotes?: unknown };
    const safetyNotes = Array.isArray(parsed.safetyNotes)
      ? parsed.safetyNotes.filter((note): note is string => typeof note === 'string').slice(0, 4)
      : profile.safetyNotes.slice(0, 4);
    return {
      source: 'ai',
      headline: parsed.headline?.trim() || `${profile.emoji} ${profile.label} guidance`,
      summary: parsed.summary?.trim() || profile.disposition,
      nextAction: parsed.nextAction?.trim() || profile.specialHandling,
      safetyNotes,
      reasoning: parsed.reasoning?.trim() || 'AI guidance based on the current local context.',
    };
  } catch {
    return fallbackGuidance(profile, earth911);
  }
}

export async function generateAiGuidance(input: {
  profile: ItemProfile;
  earth911: Earth911LookupResult;
  itemText: string;
  barcode?: string;
}): Promise<AiGuidanceResult> {
  const { profile, earth911, itemText, barcode } = input;
  if (!AI_BASE_URL || !AI_API_KEY) {
    return fallbackGuidance(profile, earth911);
  }

  try {
    const response = await fetch(`${AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: 'You are a concise recycling assistant.' },
          { role: 'user', content: buildPrompt(profile, earth911, itemText, barcode) },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return fallbackGuidance(profile, earth911);
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return fallbackGuidance(profile, earth911);
    }

    return parseAssistantResponse(content, profile, earth911);
  } catch {
    return fallbackGuidance(profile, earth911);
  }
}
