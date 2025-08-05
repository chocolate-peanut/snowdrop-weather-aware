interface AlertMapping {
  type: "rain" | "uv" | "air" | "general" | "storm" | "snow" | "earthquake" | "flood" | "tornado" | "hurricane" | "fire" | "fog" | "wind" | "heat" | "cold";
  severity: "minor" | "moderate" | "severe" | "extreme";
}

export function mapAlertToNotificationType(headline: string, severity: string): AlertMapping {
  const lowerHeadline = headline.toLowerCase();
  const lowerSeverity = severity.toLowerCase();

  // Map severity levels
  let mappedSeverity: AlertMapping['severity'] = 'moderate';
  if (lowerSeverity.includes('extreme') || lowerSeverity.includes('high')) {
    mappedSeverity = 'extreme';
  } else if (lowerSeverity.includes('severe') || lowerSeverity.includes('major')) {
    mappedSeverity = 'severe';
  } else if (lowerSeverity.includes('minor') || lowerSeverity.includes('low')) {
    mappedSeverity = 'minor';
  }

  // Map alert types based on keywords
  if (lowerHeadline.includes('storm') || lowerHeadline.includes('thunder')) {
    return { type: 'storm', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('snow') || lowerHeadline.includes('blizzard') || lowerHeadline.includes('winter')) {
    return { type: 'snow', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('earthquake') || lowerHeadline.includes('seismic')) {
    return { type: 'earthquake', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('flood') || lowerHeadline.includes('flooding')) {
    return { type: 'flood', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('tornado') || lowerHeadline.includes('twister')) {
    return { type: 'tornado', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('hurricane') || lowerHeadline.includes('typhoon') || lowerHeadline.includes('cyclone')) {
    return { type: 'hurricane', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('fire') || lowerHeadline.includes('wildfire')) {
    return { type: 'fire', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('fog') || lowerHeadline.includes('visibility')) {
    return { type: 'fog', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('wind') || lowerHeadline.includes('gale')) {
    return { type: 'wind', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('heat') || lowerHeadline.includes('hot') || lowerHeadline.includes('temperature')) {
    return { type: 'heat', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('cold') || lowerHeadline.includes('freeze') || lowerHeadline.includes('frost')) {
    return { type: 'cold', severity: mappedSeverity };
  }
  if (lowerHeadline.includes('rain') || lowerHeadline.includes('precipitation')) {
    return { type: 'rain', severity: mappedSeverity };
  }

  // Default to general alert
  return { type: 'general', severity: mappedSeverity };
}