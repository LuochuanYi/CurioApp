# Chinese Lullaby Audio Downloads 🎵

## 🎯 **Priority Chinese Lullabies for CurioApp**

### **Immediate Downloads Needed (Phase 1):**

1. **小星星 (Xiǎo Xīngxīng) - Little Star**
   - **File Name**: `xiao-xing-xing-chinese.mp3`
   - **Search Terms**: "小星星 儿歌", "Chinese Twinkle Star children song"
   - **Duration**: ~2-3 minutes
   - **Quality**: 320 kbps minimum for clear vocals

2. **摇篮曲 (Yáolán Qū) - Chinese Lullaby**
   - **File Name**: `yaolan-qu-chinese-lullaby.mp3` 
   - **Search Terms**: "中国摇篮曲", "Chinese cradle song traditional"
   - **Duration**: ~3-4 minutes
   - **Quality**: Gentle, soothing version preferred

3. **两只老虎 (Liǎng Zhī Lǎohǔ) - Two Tigers**
   - **File Name**: `liang-zhi-lao-hu-two-tigers.mp3`
   - **Search Terms**: "两只老虎 儿歌", "Chinese two tigers nursery rhyme"
   - **Duration**: ~2-3 minutes  
   - **Quality**: Clear, playful children's version

4. **数鸭子 (Shǔ Yāzi) - Counting Ducks**
   - **File Name**: `shu-yazi-counting-ducks.mp3`
   - **Search Terms**: "数鸭子 儿歌", "counting ducks Chinese children song"
   - **Duration**: ~3-4 minutes
   - **Quality**: Educational, clear pronunciation

## 📥 **Recommended Download Sources:**

### **Free/Legal Options:**
1. **YouTube to MP3** (for non-commercial educational content):
   - Search: "小星星 儿歌 无版权" (copyright-free versions)
   - Use: youtube-dl or online converters
   - Quality: 320kbps minimum

2. **Freesound.org** - Creative Commons licensed:
   - Search: "Chinese lullaby", "Chinese children song"
   - Filter: CC0 or CC-BY licenses
   - Download: Direct MP3

3. **Archive.org** - Public domain recordings:
   - Search: "Chinese nursery rhymes"
   - Filter: Audio files
   - Look for: Traditional recordings

### **Premium/Commercial Options:**
1. **Epidemic Sound** - Royalty-free music:
   - Search: "Chinese lullaby", "Asian children music"
   - License: Commercial use allowed
   - Quality: Professional recordings

2. **AudioJungle** - Stock music marketplace:
   - Category: Children's music, lullabies
   - Filter: Chinese, Asian
   - Purchase: Individual tracks

3. **Pond5** - Royalty-free audio:
   - Search: "Chinese children songs"
   - License: Varies by track
   - Quality: Broadcast quality

### **Traditional/Authentic Sources:**
1. **Chinese Cultural Centers** - Often have free resources
2. **University Music Departments** - May have recordings
3. **Chinese Community Organizations** - Traditional versions

## 🎵 **Specific YouTube Channels for High-Quality Chinese Children's Songs:**

1. **贝瓦儿歌 (Beva Children's Songs)**
   - Channel: Official children's music producer
   - Quality: Professional recordings
   - Content: Traditional and modern versions

2. **小伴龙 (Xiao Ban Long)**
   - Channel: Educational children's content
   - Quality: Clear pronunciation, kid-friendly
   - Content: Learning-focused versions

3. **碰碰狐 (Pinkfong Chinese)**
   - Channel: International children's brand
   - Quality: High production value
   - Content: Modern arrangements of classics

## 📁 **File Organization for CurioApp:**

### **Naming Convention:**
```
assets/audio/songs/chinese/
├── xiao-xing-xing-chinese.mp3           (小星星)
├── yaolan-qu-chinese-lullaby.mp3        (摇篮曲)
├── liang-zhi-lao-hu-two-tigers.mp3     (两只老虎)  
├── shu-yazi-counting-ducks.mp3          (数鸭子)
├── mo-li-hua-jasmine-flower.mp3         (茉莉花)
├── xiao-yan-zi-little-swallow.mp3       (小燕子)
├── mama-hao-mothers-love.mp3            (世上只有妈妈好)
└── wai-po-qiao-grandmas-bridge.mp3      (摇啊摇，摇到外婆桥)
```

### **Audio Specifications:**
- **Format**: MP3
- **Quality**: 320 kbps minimum  
- **Sample Rate**: 44.1 kHz
- **Duration**: 2-5 minutes optimal
- **Volume**: Normalized to prevent sudden volume changes

## 🛠 **Quick Download Commands:**

### **Using yt-dlp (Recommended):**
```bash
# Install yt-dlp
pip install yt-dlp

# Download specific Chinese lullabies
yt-dlp -f "bestaudio[ext=mp3]" --embed-subs --write-auto-sub \
  "https://www.youtube.com/watch?v=[VIDEO_ID]" \
  -o "assets/audio/songs/chinese/%(title)s.%(ext)s"
```

### **Using youtube-dl:**
```bash
youtube-dl --extract-audio --audio-format mp3 --audio-quality 320K \
  "https://www.youtube.com/watch?v=[VIDEO_ID]" \
  -o "assets/audio/songs/chinese/%(title)s.%(ext)s"
```

## 🎯 **Recommended Specific Videos to Download:**

### **1. 小星星 (Little Star):**
- **Search**: "小星星 儿歌 贝瓦"
- **Look for**: Clear vocals, 2-3 minute versions
- **Avoid**: Versions with too much background music

### **2. 摇篮曲 (Chinese Lullaby):**
- **Search**: "中国摇篮曲 传统"
- **Look for**: Gentle, traditional arrangements
- **Avoid**: Modern pop arrangements

### **3. 两只老虎 (Two Tigers):**
- **Search**: "两只老虎 经典儿歌"
- **Look for**: Playful but clear versions
- **Avoid**: Overly electronic versions

### **4. 数鸭子 (Counting Ducks):**
- **Search**: "数鸭子 教育儿歌"
- **Look for**: Educational versions with counting emphasis
- **Avoid**: Versions without clear number pronunciation

## ⚖️ **Legal Considerations:**

### **For Educational/Non-Commercial Use:**
- **Fair Use**: Educational content may qualify
- **Attribution**: Always credit original artists
- **Transformation**: Adding sign language makes it transformative

### **For Commercial Distribution:**
- **Licensing Required**: Must obtain proper licenses
- **Royalty-Free**: Use only verified royalty-free sources
- **Creative Commons**: Check specific CC license terms

### **CurioApp Recommendation:**
1. **Start with**: Creative Commons or public domain versions
2. **Upgrade to**: Licensed commercial versions before app store release
3. **Consider**: Recording original versions with native speakers

## 📞 **Next Steps:**

1. **Download Phase 1 songs** using recommended sources
2. **Place files** in `assets/audio/songs/` directory
3. **Test audio quality** with your current audio system
4. **Update songs.js** with new Chinese lullaby entries
5. **Configure Chinese TTS** for optimal pronunciation

Would you like me to help you:
1. **Set up the file structure** for Chinese songs?
2. **Update the songs.js** with placeholder entries?
3. **Configure Chinese voice settings** in the multilingual TTS?
4. **Create download scripts** for automated audio acquisition?

This will make CurioApp the premier multilingual children's app! 🌟