import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { logAudio } from '../utils/logger';

const SignLanguageAnimation = ({ word, gestureType, isActive, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animation configurations for different gesture types and words
  const getAnimationConfig = (word, gestureType) => {
    const wordLower = word.toLowerCase();
    
    // Specific word animations with detailed finger movements
    const wordAnimations = {
      'twinkle': {
        emoji: '🤏',
        animation: 'fingerSparkle',
        duration: 800,
        phases: ['🤏', '✊', '🖐️', '✋', '🤏'], // Show finger opening/closing motion
        description: 'Open and close fingers repeatedly'
      },
      'star': {
        emoji: '☝️',
        animation: 'pointTwinkle',
        duration: 1000,
        phases: ['☝️', '🫰', '✨', '☝️'], // Point then finger snap gesture
        description: 'Point up then wiggle fingers'
      },
      'little': {
        emoji: '🤏',
        animation: 'pinchMotion',
        duration: 600,
        phases: ['🤏', '👌', '🤏'], // Pinching gesture
        description: 'Pinch thumb and finger together'
      },
      'wonder': {
        emoji: '🤔',
        animation: 'thinkGesture',
        duration: 1200,
        phases: ['🤔', '☝️', '💭', '🤔'], // Touch temple, point up, think
        description: 'Finger to temple, thoughtful look'
      },
      'what': {
        emoji: '🤷‍♀️',
        animation: 'questionGesture',
        duration: 800,
        phases: ['🤷‍♀️', '�', '🤷‍♀️'], // Shrug with open palms
        description: 'Shrug shoulders with open palms'
      },
      'you': {
        emoji: '�',
        animation: 'pointForward',
        duration: 500,
        phases: ['�', '☝️', '👆'], // Point forward then up
        description: 'Point upward to the sky'
      },
      'up': {
        emoji: '👆',
        animation: 'pointUpward',
        duration: 600,
        phases: ['👆', '🙌', '�'], // Point up, raise both hands, point up
        description: 'Point both hands upward'
      },
      'above': {
        emoji: '🙌',
        animation: 'raiseHands',
        duration: 700,
        phases: ['�‍♀️', '�', '�'], // Raise one hand, both hands, high gesture
        description: 'Raise hands high over head'
      },
      'world': {
        emoji: '🫴',
        animation: 'circleGesture',
        duration: 1500,
        phases: ['🫴', '👐', '🤲', '🫴'], // Cupped hands forming circle
        description: 'Make a big circle with arms'
      },
      'high': {
        emoji: '�',
        animation: 'reachUp',
        duration: 800,
        phases: ['�', '�🔝', '🤲'], // Reach up high
        description: 'Stretch arms as high as possible'
      },
      'like': {
        emoji: '👍',
        animation: 'approvalNod',
        duration: 600,
        phases: ['👍', '😊', '👍'], // Thumbs up with smile
        description: 'Nod and smile approvingly'
      },
      'diamond': {
        emoji: '🫰',
        animation: 'sparkleFingers',
        duration: 1000,
        phases: ['💎', '🫰', '✨', '🤌'], // Diamond, finger snap, sparkle, pinched fingers
        description: 'Make sparkly gestures with fingers'
      },
      'sky': {
        emoji: '👐',
        animation: 'sweepGesture',
        duration: 1200,
        phases: ['👐', '🙌', '🤲', '👐'], // Open arms sweeping motion
        description: 'Sweep arms across overhead like sky'
      },

      // ABC Song animations
      'a': { emoji: '✊', animation: 'fingerPoint', duration: 500, phases: ['✊', '👊', '✊'], description: 'Make fist with thumb beside' },
      'b': { emoji: '🖐️', animation: 'fingerPoint', duration: 500, phases: ['🖐️', '✋', '🖐️'], description: 'Hold up four fingers' },
      'c': { emoji: '🤏', animation: 'pinchMotion', duration: 500, phases: ['🤏', '👌', '🤏'], description: 'Curve hand like C' },
      'd': { emoji: '☝️', animation: 'fingerPoint', duration: 500, phases: ['☝️', '👆', '☝️'], description: 'Point index up' },
      'e': { emoji: '✊', animation: 'pinchMotion', duration: 500, phases: ['✊', '🤏', '✊'], description: 'Curl fingertips to thumb' },
      'f': { emoji: '👌', animation: 'fingerPoint', duration: 500, phases: ['👌', '☝️', '👌'], description: 'Touch thumb to index' },
      'g': { emoji: '🤌', animation: 'fingerPoint', duration: 500, phases: ['🤌', '👈', '🤌'], description: 'Point index and thumb' },
      'h': { emoji: '✌️', animation: 'fingerPoint', duration: 500, phases: ['✌️', '🤞', '✌️'], description: 'Point two fingers sideways' },
      'i': { emoji: '🤘', animation: 'fingerPoint', duration: 500, phases: ['🤘', '🤙', '🤘'], description: 'Point pinky up' },
      'now': { emoji: '👇', animation: 'pointForward', duration: 600, phases: ['👇', '🤲', '👇'], description: 'Palms down to chest' },
      'know': { emoji: '🧠', animation: 'thinkGesture', duration: 800, phases: ['🧠', '🤔', '🧠'], description: 'Tap temple with fingers' },
      'my': { emoji: '🫱', animation: 'pointForward', duration: 500, phases: ['🫱', '👋', '🫱'], description: 'Palm on chest' },
      'next': { emoji: '👉', animation: 'pointForward', duration: 500, phases: ['👉', '➡️', '👉'], description: 'Move hand forward' },
      'time': { emoji: '⌚', animation: 'fingerPoint', duration: 500, phases: ['⌚', '⏰', '⌚'], description: 'Tap wrist' },
      'sing': { emoji: '🎤', animation: 'sweepGesture', duration: 800, phases: ['🎤', '🎵', '🎤'], description: 'Hand from mouth outward' },

      // If You're Happy animations
      'happy': { emoji: '😊', animation: 'approvalNod', duration: 800, phases: ['😊', '😄', '😁', '😊'], description: 'Smile and pat chest' },
      'clap': { emoji: '👏', animation: 'fingerSparkle', duration: 600, phases: ['👏', '🙌', '👏'], description: 'Clap hands together' },
      'hands': { emoji: '🙌', animation: 'handWave', duration: 500, phases: ['🙌', '👐', '🙌'], description: 'Show both hands' },
      'face': { emoji: '😀', animation: 'faceExpress', duration: 700, phases: ['😀', '😊', '😄', '😀'], description: 'Point to face smiling' },
      'show': { emoji: '👁️', animation: 'pointForward', duration: 500, phases: ['👁️', '👀', '👁️'], description: 'Present proudly' },
      'stomp': { emoji: '🦶', animation: 'bodyMove', duration: 800, phases: ['🦶', '👣', '🦶'], description: 'Stomp feet with energy' },
      'feet': { emoji: '👣', animation: 'bodyMove', duration: 500, phases: ['👣', '🦶', '👣'], description: 'Show feet movement' },
      'shout': { emoji: '📢', animation: 'sweepGesture', duration: 600, phases: ['📢', '🗣️', '📢'], description: 'Cup hands around mouth' },
      'hooray': { emoji: '🎉', animation: 'raiseHands', duration: 800, phases: ['🎉', '🙌', '🎊', '🎉'], description: 'Throw arms up and cheer' },

      // Wheels on Bus animations  
      'wheels': { emoji: '⭕', animation: 'circleGesture', duration: 1000, phases: ['⭕', '🔄', '⭕'], description: 'Roll hands in circles' },
      'bus': { emoji: '🚌', animation: 'handWave', duration: 800, phases: ['🚌', '🚍', '🚌'], description: 'Hold steering wheel' },
      'round': { emoji: '🔄', animation: 'circleGesture', duration: 1200, phases: ['🔄', '↩️', '🔁', '🔄'], description: 'Big circular motions' },
      'wipers': { emoji: '🌊', animation: 'sweepGesture', duration: 1000, phases: ['🌊', '💧', '🌊'], description: 'Back and forth like wipers' },
      'swish': { emoji: '💨', animation: 'sweepGesture', duration: 600, phases: ['💨', '🌬️', '💨'], description: 'Swishing motion and sound' },
      'horn': { emoji: '📯', animation: 'fingerPoint', duration: 500, phases: ['📯', '🔊', '📯'], description: 'Press palm like honking' },
      'beep': { emoji: '🔊', animation: 'fingerSparkle', duration: 400, phases: ['🔊', '📢', '🔊'], description: 'Beeping gestures and sounds' },
      'doors': { emoji: '🚪', animation: 'sweepGesture', duration: 800, phases: ['🚪', '↔️', '🚪'], description: 'Move hands apart then together' },
      'open': { emoji: '↔️', animation: 'sweepGesture', duration: 600, phases: ['↔️', '🙌', '↔️'], description: 'Spread arms wide' },
      'shut': { emoji: '🤝', animation: 'pinchMotion', duration: 500, phases: ['🤝', '👏', '🤝'], description: 'Bring arms together' },
      'people': { emoji: '👥', animation: 'handWave', duration: 700, phases: ['👥', '👋', '👥'], description: 'Wave to passengers' },

      // Rain Rain Go Away animations
      'rain': { emoji: '🌧️', animation: 'fingerSparkle', duration: 1000, phases: ['🌧️', '💧', '☔', '🌧️'], description: 'Wiggle fingers like raindrops' },
      'go': { emoji: '👋', animation: 'sweepGesture', duration: 600, phases: ['👋', '🤚', '👋'], description: 'Gentle shooing motion' },
      'away': { emoji: '👈', animation: 'sweepGesture', duration: 600, phases: ['👈', '➡️', '👈'], description: 'Motion away from self' },
      'come': { emoji: '👋', animation: 'sweepGesture', duration: 600, phases: ['👋', '🤲', '👋'], description: 'Beckoning motion' },
      'another': { emoji: '📅', animation: 'fingerPoint', duration: 500, phases: ['📅', '🗓️', '📅'], description: 'Point to tomorrow' },
      'day': { emoji: '☀️', animation: 'sweepGesture', duration: 800, phases: ['☀️', '🌅', '☀️'], description: 'Arc like sun movement' },
      'children': { emoji: '👶', animation: 'pinchMotion', duration: 600, phases: ['👶', '🧒', '👶'], description: 'Indicate small height' },
      'want': { emoji: '🙏', animation: 'approvalNod', duration: 600, phases: ['🙏', '🤲', '🙏'], description: 'Wanting gesture' },
      'play': { emoji: '🎮', animation: 'bodyMove', duration: 800, phases: ['🎮', '🤹', '🎮'], description: 'Excited jumping motions' },

      // Five Little Ducks animations
      'five': { emoji: '🖐️', animation: 'fingerPoint', duration: 600, phases: ['🖐️', '✋', '🖐️'], description: 'Hold up five fingers' },
      'ducks': { emoji: '🦆', animation: 'handWave', duration: 800, phases: ['🦆', '🐥', '🦆'], description: 'Make duck bills with hands' },
      'swimming': { emoji: '🏊', animation: 'sweepGesture', duration: 1000, phases: ['🏊', '🌊', '🏊'], description: 'Swimming motions with arms' },
      'over': { emoji: '⛰️', animation: 'sweepGesture', duration: 800, phases: ['⛰️', '🏔️', '⛰️'], description: 'Arc over imaginary hill' },
      'hill': { emoji: '🏔️', animation: 'raiseHands', duration: 600, phases: ['🏔️', '⛰️', '🏔️'], description: 'Show hill shape' },
      'far': { emoji: '👉', animation: 'pointForward', duration: 600, phases: ['👉', '🔭', '👉'], description: 'Point into distance' },
      'mother': { emoji: '🦆', animation: 'raiseHands', duration: 700, phases: ['🦆', '👩', '🦆'], description: 'Larger duck gesture' },
      'duck': { emoji: '🦆', animation: 'handWave', duration: 500, phases: ['🦆', '🐤', '🦆'], description: 'Duck bill motion' },
      'quack': { emoji: '🗣️', animation: 'fingerSparkle', duration: 400, phases: ['🗣️', '🦆', '🗣️'], description: 'Open/close like quacking' },
      'four': { emoji: '🖖', animation: 'fingerPoint', duration: 500, phases: ['🖖', '4️⃣', '🖖'], description: 'Hold up four fingers' },
      'came': { emoji: '🔙', animation: 'sweepGesture', duration: 600, phases: ['🔙', '👋', '🔙'], description: 'Motion toward self' },
      'back': { emoji: '↩️', animation: 'sweepGesture', duration: 600, phases: ['↩️', '🔄', '↩️'], description: 'Return motion' },

      // Bedtime/Lullaby animations
      'lullaby': { emoji: '🍼', animation: 'sweepGesture', duration: 1200, phases: ['🍼', '👶', '🌙', '🍼'], description: 'Rock like holding baby' },
      'good': { emoji: '👍', animation: 'approvalNod', duration: 600, phases: ['👍', '😊', '👍'], description: 'Good gesture' },
      'night': { emoji: '🌙', animation: 'sweepGesture', duration: 800, phases: ['🌙', '💤', '🌙'], description: 'Gentle wave goodbye' },
      'sleep': { emoji: '😴', animation: 'sweepGesture', duration: 1000, phases: ['😴', '💤', '😴'], description: 'Sleepy gestures' },
      'dream': { emoji: '💭', animation: 'sparkleFingers', duration: 1200, phases: ['💭', '✨', '🌟', '💭'], description: 'Dreamy motions' },

      // New classic song animations
      'brother': { emoji: '👨', animation: 'pointForward', duration: 600, phases: ['👨', '👦', '👨'], description: 'Point to brother' },
      'john': { emoji: '🧑', animation: 'handWave', duration: 500, phases: ['🧑', '👋', '🧑'], description: 'Wave to John' },
      'sleeping': { emoji: '😴', animation: 'sweepGesture', duration: 1000, phases: ['😴', '💤', '😴'], description: 'Sleeping motion' },
      'bells': { emoji: '🔔', animation: 'handWave', duration: 800, phases: ['🔔', '🛎️', '🔔'], description: 'Ring bells motion' },
      'morning': { emoji: '🌅', animation: 'raiseHands', duration: 800, phases: ['🌅', '☀️', '🌅'], description: 'Morning sunrise' },
      'ringing': { emoji: '🛎️', animation: 'handWave', duration: 600, phases: ['🛎️', '🔔', '🛎️'], description: 'Bell ringing motion' },
      
      'mary': { emoji: '👧', animation: 'pointForward', duration: 500, phases: ['👧', '🧒', '👧'], description: 'Point to Mary' },
      'lamb': { emoji: '🐑', animation: 'handWave', duration: 600, phases: ['🐑', '🐏', '🐑'], description: 'Lamb gesture' },
      'little': { emoji: '🤏', animation: 'pinchMotion', duration: 500, phases: ['🤏', '👌', '🤏'], description: 'Show small size' },
      'fleece': { emoji: '🧶', animation: 'handWave', duration: 600, phases: ['🧶', '☁️', '🧶'], description: 'Soft wool motion' },
      'white': { emoji: '⚪', animation: 'handWave', duration: 500, phases: ['⚪', '🤍', '⚪'], description: 'Show white color' },
      'snow': { emoji: '❄️', animation: 'fingerSparkle', duration: 800, phases: ['❄️', '🌨️', '❄️'], description: 'Snow falling' },
      
      'baa': { emoji: '🐑', animation: 'handWave', duration: 400, phases: ['🐑', '🗣️', '🐑'], description: 'Sheep sound' },
      'black': { emoji: '⚫', animation: 'handWave', duration: 500, phases: ['⚫', '🖤', '⚫'], description: 'Black color' },
      'sheep': { emoji: '🐑', animation: 'handWave', duration: 600, phases: ['🐑', '🐏', '🐑'], description: 'Sheep motion' },
      'wool': { emoji: '🧶', animation: 'handWave', duration: 600, phases: ['🧶', '☁️', '🧶'], description: 'Wool texture' },
      'yes': { emoji: '✅', animation: 'approvalNod', duration: 500, phases: ['✅', '👍', '✅'], description: 'Yes gesture' },
      'sir': { emoji: '🎩', animation: 'approvalNod', duration: 500, phases: ['🎩', '🫡', '🎩'], description: 'Respectful greeting' },
      'three': { emoji: '3️⃣', animation: 'fingerPoint', duration: 500, phases: ['3️⃣', '🖖', '3️⃣'], description: 'Three fingers' },
      'bags': { emoji: '🎒', animation: 'handWave', duration: 600, phases: ['🎒', '👜', '🎒'], description: 'Bag gesture' },
      'full': { emoji: '🈵', animation: 'raiseHands', duration: 600, phases: ['🈵', '🤲', '🈵'], description: 'Full gesture' },
      
      'humpty': { emoji: '🥚', animation: 'handWave', duration: 600, phases: ['🥚', '🤲', '🥚'], description: 'Egg shape' },
      'dumpty': { emoji: '🥚', animation: 'bodyMove', duration: 600, phases: ['🥚', '🤸', '🥚'], description: 'Tumbling motion' },
      'sat': { emoji: '🪑', animation: 'bodyMove', duration: 500, phases: ['🪑', '🧘', '🪑'], description: 'Sitting motion' },
      'wall': { emoji: '🧱', animation: 'handWave', duration: 600, phases: ['🧱', '🏗️', '🧱'], description: 'Build wall' },
      'fall': { emoji: '⬇️', animation: 'bodyMove', duration: 800, phases: ['⬇️', '💥', '⬇️'], description: 'Falling motion' },
      'great': { emoji: '🌟', animation: 'raiseHands', duration: 600, phases: ['🌟', '✨', '🌟'], description: 'Great gesture' },
      'king': { emoji: '👑', animation: 'raiseHands', duration: 600, phases: ['👑', '🤴', '👑'], description: 'King gesture' },
      'horses': { emoji: '🐎', animation: 'bodyMove', duration: 800, phases: ['🐎', '🏇', '🐎'], description: 'Horse galloping' },
      'men': { emoji: '👨‍👨‍👦', animation: 'handWave', duration: 600, phases: ['👨‍👨‍👦', '👥', '👨‍👨‍👦'], description: 'Group of men' },
      'put': { emoji: '🤲', animation: 'handWave', duration: 500, phases: ['🤲', '🔧', '🤲'], description: 'Put together' },
      'together': { emoji: '🤝', animation: 'handWave', duration: 600, phases: ['🤝', '🤲', '🤝'], description: 'Join together' },
      'again': { emoji: '🔄', animation: 'circleGesture', duration: 600, phases: ['🔄', '🔁', '🔄'], description: 'Repeat again' },
      
      'old': { emoji: '👴', animation: 'handWave', duration: 500, phases: ['👴', '👨‍🦳', '👴'], description: 'Old person' },
      'macdonald': { emoji: '👨‍🌾', animation: 'handWave', duration: 600, phases: ['👨‍🌾', '🧑‍🌾', '👨‍🌾'], description: 'Farmer' },
      'farm': { emoji: '🚜', animation: 'handWave', duration: 600, phases: ['🚜', '🌾', '🚜'], description: 'Farm gesture' },
      'cow': { emoji: '🐄', animation: 'handWave', duration: 600, phases: ['🐄', '🐮', '🐄'], description: 'Cow gesture' },
      'moo': { emoji: '🐮', animation: 'handWave', duration: 400, phases: ['🐮', '🗣️', '🐮'], description: 'Moo sound' },
      'here': { emoji: '👈', animation: 'pointForward', duration: 400, phases: ['👈', '📍', '👈'], description: 'Point here' },
      'there': { emoji: '👉', animation: 'pointForward', duration: 400, phases: ['👉', '📍', '👉'], description: 'Point there' },
      
      'row': { emoji: '🚣', animation: 'bodyMove', duration: 600, phases: ['🚣', '🚣‍♂️', '🚣'], description: 'Rowing motion' },
      'boat': { emoji: '⛵', animation: 'handWave', duration: 600, phases: ['⛵', '🛶', '⛵'], description: 'Boat motion' },
      'gently': { emoji: '🤲', animation: 'sweepGesture', duration: 800, phases: ['🤲', '☁️', '🤲'], description: 'Gentle motion' },
      'down': { emoji: '⬇️', animation: 'pointForward', duration: 400, phases: ['⬇️', '👇', '⬇️'], description: 'Downward' },
      'stream': { emoji: '🌊', animation: 'sweepGesture', duration: 800, phases: ['🌊', '💧', '🌊'], description: 'Flowing stream' },
      'merrily': { emoji: '😄', animation: 'bodyMove', duration: 600, phases: ['😄', '🎉', '😄'], description: 'Happy bouncing' },
      'life': { emoji: '💖', animation: 'raiseHands', duration: 800, phases: ['💖', '❤️', '💖'], description: 'Life gesture' },
      'is': { emoji: '✨', animation: 'handWave', duration: 400, phases: ['✨', '⭐', '✨'], description: 'Is gesture' },
      'but': { emoji: '🤔', animation: 'handWave', duration: 400, phases: ['🤔', '💭', '🤔'], description: 'But gesture' },
      
      // Hickory Dickory Dock animations
      'hickory': { emoji: '🕐', animation: 'handWave', duration: 600, phases: ['🕐', '⏰', '🕐'], description: 'Clock ticking motion' },
      'dickory': { emoji: '🕑', animation: 'handWave', duration: 600, phases: ['🕑', '⏱️', '🕑'], description: 'Clock ticking rhythm' },
      'dock': { emoji: '🕒', animation: 'handWave', duration: 600, phases: ['🕒', '⏰', '🕒'], description: 'Clock face motion' },
      'mouse': { emoji: '🐭', animation: 'fingerPoint', duration: 500, phases: ['🐭', '🐀', '🐭'], description: 'Small mouse gesture' },
      'ran': { emoji: '🏃', animation: 'bodyMove', duration: 600, phases: ['🏃', '💨', '🏃'], description: 'Running motion' },
      'up': { emoji: '⬆️', animation: 'raiseHands', duration: 500, phases: ['⬆️', '☝️', '⬆️'], description: 'Upward motion' },
      'clock': { emoji: '🕐', animation: 'circleGesture', duration: 800, phases: ['🕐', '⏰', '🕐'], description: 'Clock face and hands' },
      'struck': { emoji: '🔔', animation: 'fingerSparkle', duration: 600, phases: ['🔔', '⚡', '🔔'], description: 'Clock striking motion' },
      'one': { emoji: '1️⃣', animation: 'fingerPoint', duration: 500, phases: ['1️⃣', '☝️', '1️⃣'], description: 'One finger up' }
    };

    // Fallback to gesture type animations with detailed movements
    const gestureAnimations = {
      'hand': { 
        emoji: '✋', 
        animation: 'handWave', 
        duration: 800, 
        phases: ['✋', '👋', '🤚', '✋'],
        description: 'Wave hand back and forth'
      },
      'finger': { 
        emoji: '👆', 
        animation: 'fingerPoint', 
        duration: 500, 
        phases: ['👆', '☝️', '🫵', '👆'],
        description: 'Point with finger'
      },
      'body': { 
        emoji: '🙋‍♀️', 
        animation: 'bodyMove', 
        duration: 1000, 
        phases: ['🙋‍♀️', '🤸‍♀️', '💃', '🙋‍♀️'],
        description: 'Use body movement'
      },
      'facial': { 
        emoji: '😊', 
        animation: 'faceExpress', 
        duration: 700, 
        phases: ['😊', '😄', '�', '�😊'],
        description: 'Facial expression'
      }
    };

    return wordAnimations[wordLower] || gestureAnimations[gestureType] || gestureAnimations['hand'];
  };

  const config = getAnimationConfig(word, gestureType);

  // Start animation when component becomes active
  useEffect(() => {
    if (isActive) {
      logAudio('Starting sign animation for:', word);
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isActive]);

  const startAnimation = () => {
    const { animation, duration } = config;
    
    // Reset animation
    animatedValue.setValue(0);
    scaleValue.setValue(1);
    rotateValue.setValue(0);
    setAnimationPhase(0);
    
    // Start continuous animation loop
    const createAnimation = () => {
      switch (animation) {
        case 'fingerSparkle':
        case 'sparkleFingers':
          return Animated.loop(
            Animated.sequence([
              // Closed hand
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 0.8,
                  duration: duration / 5,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }),
                Animated.timing(rotateValue, {
                  toValue: -0.1,
                  duration: duration / 5,
                  useNativeDriver: true,
                })
              ]),
              // Opening fingers
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1.2,
                  duration: duration / 5,
                  easing: Easing.elastic(2),
                  useNativeDriver: true,
                }),
                Animated.timing(rotateValue, {
                  toValue: 0.1,
                  duration: duration / 5,
                  useNativeDriver: true,
                })
              ]),
              // Sparkle effect
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1.3,
                  duration: duration / 5,
                  easing: Easing.bounce,
                  useNativeDriver: true,
                }),
                Animated.timing(rotateValue, {
                  toValue: 0,
                  duration: duration / 5,
                  useNativeDriver: true,
                })
              ]),
              // Hold sparkle
              Animated.timing(scaleValue, {
                toValue: 1.1,
                duration: duration / 5,
                easing: Easing.inOut(Easing.sine),
                useNativeDriver: true,
              }),
              // Return to normal
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: duration / 5,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }),
                Animated.timing(rotateValue, {
                  toValue: 0,
                  duration: duration / 5,
                  useNativeDriver: true,
                })
              ])
            ])
          );

        case 'sparkle':
        case 'twinkle':
        case 'pointTwinkle':
          return Animated.loop(
            Animated.sequence([
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1.3,
                  duration: duration / 4,
                  easing: Easing.elastic(1),
                  useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                  toValue: 1,
                  duration: duration / 4,
                  useNativeDriver: false,
                })
              ]),
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 0.8,
                  duration: duration / 4,
                  easing: Easing.elastic(1),
                  useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                  toValue: 0.5,
                  duration: duration / 4,
                  useNativeDriver: false,
                })
              ]),
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1.2,
                  duration: duration / 4,
                  easing: Easing.elastic(1),
                  useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                  toValue: 0.8,
                  duration: duration / 4,
                  useNativeDriver: false,
                })
              ]),
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: duration / 4,
                  easing: Easing.elastic(1),
                  useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                  toValue: 0,
                  duration: duration / 4,
                  useNativeDriver: false,
                })
              ])
            ])
          );

        case 'rotate':
          return Animated.loop(
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: duration,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          );

        case 'pinchMotion':
          return Animated.loop(
            Animated.sequence([
              // Open fingers
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1.1,
                  duration: duration / 3,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }),
                Animated.timing(rotateValue, {
                  toValue: 0.1,
                  duration: duration / 3,
                  useNativeDriver: true,
                })
              ]),
              // Pinch closed
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 0.9,
                  duration: duration / 3,
                  easing: Easing.in(Easing.quad),
                  useNativeDriver: true,
                }),
                Animated.timing(rotateValue, {
                  toValue: -0.1,
                  duration: duration / 3,
                  useNativeDriver: true,
                })
              ]),
              // Return to neutral
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: duration / 3,
                  easing: Easing.inOut(Easing.ease),
                  useNativeDriver: true,
                }),
                Animated.timing(rotateValue, {
                  toValue: 0,
                  duration: duration / 3,
                  useNativeDriver: true,
                })
              ])
            ])
          );

        case 'pointForward':
        case 'pointUpward':
        case 'fingerPoint':
          return Animated.loop(
            Animated.sequence([
              // Point gesture with emphasis
              Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: duration / 4,
                easing: Easing.out(Easing.back(2)),
                useNativeDriver: true,
              }),
              Animated.timing(scaleValue, {
                toValue: 1,
                duration: duration / 4,
                easing: Easing.bounce,
                useNativeDriver: true,
              }),
              // Hold point
              Animated.timing(rotateValue, {
                toValue: 0.1,
                duration: duration / 4,
                easing: Easing.inOut(Easing.sine),
                useNativeDriver: true,
              }),
              // Return
              Animated.timing(rotateValue, {
                toValue: 0,
                duration: duration / 4,
                easing: Easing.inOut(Easing.sine),
                useNativeDriver: true,
              })
            ])
          );

        case 'handWave':
        case 'wave':
        case 'point':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(rotateValue, {
                toValue: 0.2,
                duration: duration / 3,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                useNativeDriver: true,
              }),
              Animated.timing(rotateValue, {
                toValue: -0.2,
                duration: duration / 3,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                useNativeDriver: true,
              }),
              Animated.timing(rotateValue, {
                toValue: 0,
                duration: duration / 3,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                useNativeDriver: true,
              })
            ])
          );

        case 'circleGesture':
        case 'sweepGesture':
          return Animated.loop(
            Animated.sequence([
              // Start sweep left
              Animated.parallel([
                Animated.timing(rotateValue, {
                  toValue: -0.3,
                  duration: duration / 4,
                  easing: Easing.inOut(Easing.sine),
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1.1,
                  duration: duration / 4,
                  useNativeDriver: true,
                })
              ]),
              // Sweep to center
              Animated.timing(rotateValue, {
                toValue: 0,
                duration: duration / 4,
                easing: Easing.inOut(Easing.sine),
                useNativeDriver: true,
              }),
              // Sweep right
              Animated.parallel([
                Animated.timing(rotateValue, {
                  toValue: 0.3,
                  duration: duration / 4,
                  easing: Easing.inOut(Easing.sine),
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1.1,
                  duration: duration / 4,
                  useNativeDriver: true,
                })
              ]),
              // Return to center
              Animated.parallel([
                Animated.timing(rotateValue, {
                  toValue: 0,
                  duration: duration / 4,
                  easing: Easing.inOut(Easing.sine),
                  useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: duration / 4,
                  useNativeDriver: true,
                })
              ])
            ])
          );

        case 'raiseHands':
        case 'reachUp':
          return Animated.loop(
            Animated.sequence([
              // Raise hands up
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1.3,
                  duration: duration / 3,
                  easing: Easing.out(Easing.back(1.5)),
                  useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                  toValue: 1,
                  duration: duration / 3,
                  useNativeDriver: false,
                })
              ]),
              // Hold high
              Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: duration / 3,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              // Lower slightly
              Animated.parallel([
                Animated.timing(scaleValue, {
                  toValue: 1,
                  duration: duration / 3,
                  easing: Easing.in(Easing.quad),
                  useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                  toValue: 0,
                  duration: duration / 3,
                  useNativeDriver: false,
                })
              ])
            ])
          );

        case 'thinkGesture':
        case 'questionGesture':
        case 'approvalNod':
        case 'bounce':
        case 'nod':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: duration / 2,
                easing: Easing.bounce,
                useNativeDriver: true,
              }),
              Animated.timing(scaleValue, {
                toValue: 1,
                duration: duration / 2,
                easing: Easing.bounce,
                useNativeDriver: true,
              })
            ])
          );

        case 'circleGesture':
          return Animated.loop(
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: duration,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          );

        case 'faceExpress':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(scaleValue, {
                toValue: 1.3,
                duration: duration / 3,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(scaleValue, {
                toValue: 1,
                duration: duration / 3,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              })
            ])
          );

        case 'bodyMove':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(translateYValue, {
                toValue: -10,
                duration: duration / 4,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(translateYValue, {
                toValue: 0,
                duration: duration / 4,
                easing: Easing.bounce,
                useNativeDriver: true,
              })
            ])
          );

        case 'raiseHands':
          return Animated.loop(
            Animated.sequence([
              Animated.timing(translateYValue, {
                toValue: -15,
                duration: duration / 2,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(translateYValue, {
                toValue: 0,
                duration: duration / 2,
                easing: Easing.bounce,
                useNativeDriver: true,
              })
            ])
          );

        default:
          return Animated.loop(
            Animated.timing(scaleValue, {
              toValue: 1.1,
              duration: duration / 2,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            { reverse: true }
          );
      }
    };

    createAnimation().start();

    // Cycle through emoji phases
    const phaseInterval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % config.phases.length);
    }, duration / config.phases.length);

    return () => clearInterval(phaseInterval);
  };

  const stopAnimation = () => {
    animatedValue.stopAnimation();
    scaleValue.stopAnimation();
    rotateValue.stopAnimation();
    
    // Reset to initial state
    animatedValue.setValue(0);
    scaleValue.setValue(1);
    rotateValue.setValue(0);
    setAnimationPhase(0);
  };

  // Get current emoji based on animation phase
  const getCurrentEmoji = () => {
    return config.phases[animationPhase] || config.emoji;
  };

  // Calculate rotation based on animation type
  const getRotation = () => {
    if (config.animation === 'rotate') {
      return rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });
    } else {
      return rotateValue.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-20deg', '20deg'],
      });
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.emojiContainer,
          {
            transform: [
              { scale: scaleValue },
              { rotate: getRotation() },
              { translateY: translateYValue }
            ]
          }
        ]}
      >
        <Text style={styles.emoji}>{getCurrentEmoji()}</Text>
      </Animated.View>
      <Text style={styles.wordText}>{word}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    minWidth: 60,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 28,
    textAlign: 'center',
  },
  wordText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    maxWidth: 60,
  },
});

export default SignLanguageAnimation;