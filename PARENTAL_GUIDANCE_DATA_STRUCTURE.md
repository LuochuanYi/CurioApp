# Parental Guidance Data Structure Reference

## Overview
This document shows the structure of the parental guidance data for developers and content managers.

---

## Main Data Object Structure

```javascript
PARENTAL_GUIDANCE = {
  BIRTH_TO_3_MONTHS: { ... },
  FOUR_TO_SEVEN_MONTHS: { ... },
  EIGHT_TO_TWELVE_MONTHS: { ... }
}
```

---

## Age Section Structure

Each age section follows this pattern:

```javascript
{
  id: 'birth_3_months',           // Unique identifier
  ageRange: '0-3 Months',         // Display range
  icon: '👶',                      // Emoji icon
  color: '#FF69B4',                // Primary color
  backgroundColor: '#FFE4F0',      // Background color
  title: 'Newborn Development...',// Full title
  description: '...',              // Brief description
  
  milestones: [                    // Array of milestone groups
    {
      title: 'Physical Development',
      items: [
        'Raises head & chest when on stomach',
        'Stretches & kicks on back',
        // ... more items
      ]
    },
    // ... more milestone groups
  ],
  
  parentTips: [                    // Array of tip categories
    {
      category: 'Bonding & Connection',
      tips: [
        'Hold your baby skin-to-skin...',
        'Talk and sing to your baby...',
        // ... more tips
      ]
    },
    // ... more categories
  ]
}
```

---

## Milestones Structure

```javascript
milestones: [
  {
    title: 'Physical Development',        // Milestone category
    items: [                               // Array of specific milestones
      'Raises head & chest when on stomach',
      'Stretches & kicks on back',
      'Opens and closes hands',
      'Brings hand to mouth',
      'Grasps and shakes toys'
    ]
  },
  {
    title: 'Social & Emotional',
    items: [
      'Begins to develop social smile',
      'Enjoys playing with people',
      // ...
    ]
  },
  {
    title: 'Sensory Development',
    items: [
      'Follows moving objects',
      // ...
    ]
  }
]
```

---

## Parent Tips Structure

```javascript
parentTips: [
  {
    category: 'Bonding & Connection',     // Tip category
    tips: [                                 // Array of tip strings
      'Hold your baby skin-to-skin to promote bonding and regulate their temperature',
      'Talk and sing to your baby frequently - they recognize your voice',
      'Make eye contact during feeding and play sessions',
      'Respond to your baby\'s cries promptly to build trust',
      'Use lullabies and soft voices to soothe your baby'
    ]
  },
  {
    category: 'Sensory Stimulation',
    tips: [
      // ... 5+ tips per category
    ]
  }
  // ... more categories (typically 3-5 per age range)
]
```

---

## Complete Age Sections Overview

### Section 1: BIRTH_TO_3_MONTHS
- **ID:** `birth_3_months`
- **Age Range:** 0-3 Months
- **Icon:** 👶
- **Color:** #FF69B4 (Pink)
- **Milestone Categories:** 3 (Physical, Social, Sensory)
- **Total Milestones:** 14
- **Tip Categories:** 4 (Bonding, Sensory, Sleep, Health)
- **Total Tips:** 20+

### Section 2: FOUR_TO_SEVEN_MONTHS
- **ID:** `4_7_months`
- **Age Range:** 4-7 Months
- **Icon:** 🎈
- **Color:** #4169E1 (Blue)
- **Milestone Categories:** 3 (Physical, Social, Cognitive)
- **Total Milestones:** 16
- **Tip Categories:** 4 (Motor, Play, Cognitive, Nutrition)
- **Total Tips:** 20+

### Section 3: EIGHT_TO_TWELVE_MONTHS
- **ID:** `8_12_months`
- **Age Range:** 8-12 Months
- **Icon:** 🚀
- **Color:** #28A745 (Green)
- **Milestone Categories:** 3 (Physical, Social, Cognitive)
- **Total Milestones:** 16
- **Tip Categories:** 5 (Mobility, Language, Independence, Separation, Sleep)
- **Total Tips:** 25+

---

## Common Concerns Structure

```javascript
COMMON_CONCERNS = {
  SLEEP: {
    title: 'Sleep Issues',                 // Display title
    icon: '😴',                             // Emoji icon
    solutions: [                            // Array of solutions
      'Establish a consistent bedtime routine',
      'Keep the room dark and at comfortable temperature',
      // ... 4 more solutions
    ]
  },
  CRYING: {
    title: 'Excessive Crying',
    icon: '😭',
    solutions: [
      'Check basic needs (hunger, diaper, tiredness)',
      // ...
    ]
  },
  FEEDING: {
    title: 'Feeding Concerns',
    icon: '🍼',
    solutions: [
      // ... 6 solutions
    ]
  },
  DEVELOPMENT: {
    title: 'Developmental Delays',
    icon: '⚠️',
    solutions: [
      // ... 6 solutions
    ]
  }
}
```

---

## Export Functions

### getGuidanceByAge(ageInMonths)
Returns the appropriate guidance section based on baby's age.

```javascript
// Usage:
const guidance = getGuidanceByAge(2);      // Returns BIRTH_TO_3_MONTHS
const guidance = getGuidanceByAge(6);      // Returns FOUR_TO_SEVEN_MONTHS
const guidance = getGuidanceByAge(10);     // Returns EIGHT_TO_TWELVE_MONTHS
```

### getAllGuidanceSections()
Returns array of all three guidance sections.

```javascript
// Usage:
const allSections = getAllGuidanceSections();
// Returns: [BIRTH_TO_3_MONTHS, FOUR_TO_SEVEN_MONTHS, EIGHT_TO_TWELVE_MONTHS]
```

---

## Content Statistics

| Metric | Value |
|--------|-------|
| Age Ranges Covered | 3 |
| Total Milestones | 45+ |
| Milestone Categories | 9 |
| Total Parent Tips | 65+ |
| Tip Categories | 16 |
| Common Concerns | 4 |
| Solutions per Concern | 6 |
| Total Solutions | 24+ |
| Colors Used | 5 |
| Icons/Emojis | 20+ |

---

## Tip Categories by Age Range

### 0-3 Months (4 Categories)
1. Bonding & Connection (5 tips)
2. Sensory Stimulation (5 tips)
3. Sleep & Comfort (5 tips)
4. Health & Safety (5 tips)

### 4-7 Months (4 Categories)
1. Motor Development (5 tips)
2. Social Play (5 tips)
3. Cognitive Games (5 tips)
4. Nutrition & Development (5 tips)

### 8-12 Months (5 Categories)
1. Mobility & Safety (5 tips)
2. Language Development (5 tips)
3. Independence & Learning (5 tips)
4. Handling Separation Anxiety (5 tips)
5. Sleep Routines (5 tips)

---

## Data Validation Checklist

- ✅ All age sections have required fields (id, ageRange, icon, color, backgroundColor, title, description)
- ✅ All milestones have title and items array
- ✅ All parent tip sections have category and tips array
- ✅ All common concerns have title, icon, and solutions array
- ✅ No duplicate content across sections
- ✅ Colors are valid hex values
- ✅ Icons are single emoji characters
- ✅ IDs are unique and lowercase with underscores

---

## Adding New Content

To add new tips, milestones, or concerns:

### Adding a Milestone
```javascript
milestones: [
  {
    title: 'New Skill Category',
    items: [
      'First milestone description',
      'Second milestone description',
      // ... add up to 5-7 items per category
    ]
  }
]
```

### Adding a Tip
```javascript
parentTips: [
  {
    category: 'New Category Name',
    tips: [
      'First tip with specific, actionable advice',
      'Second tip with clear guidance',
      // ... keep to 5-6 tips per category
    ]
  }
]
```

### Adding a Concern
```javascript
export const COMMON_CONCERNS = {
  // ... existing concerns
  NEW_CONCERN: {
    title: 'New Concern Title',
    icon: '🎯',  // Choose appropriate emoji
    solutions: [
      'Solution 1',
      'Solution 2',
      // ... keep to 5-6 solutions per concern
    ]
  }
}
```

---

## Localization Ready

All content can be easily translated. Current structure supports:
- Translation keys for section titles
- Description text (translatable)
- Milestone items (translatable)
- Tip items (translatable)
- Concern titles (translatable)
- Solution items (translatable)

---

## Performance Considerations

- Expandable sections reduce initial rendering
- Lazy loading of content when sections expand
- Minimal re-renders with proper state management
- Color codes reduce need for image assets
- Emoji icons reduce bundle size

---

## Browser/Device Compatibility

- ✅ React Native (iOS, Android)
- ✅ Web (via React Native Web)
- ✅ All modern emoji support
- ✅ Responsive to all screen sizes
- ✅ Works with screen readers (accessibility)

---

**Last Updated:** March 2026
**Version:** 1.0
