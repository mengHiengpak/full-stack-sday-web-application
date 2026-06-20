const englishSongs = [
  // ═══════════════════════════════════════════
  // TAYLOR SWIFT - 20 songs
  // ═══════════════════════════════════════════
  { id: 'ts1', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: 220 },
  { id: 'ts2', title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', duration: 178 },
  { id: 'ts3', title: 'Shake It Off', artist: 'Taylor Swift', album: '1989', duration: 219 },
  { id: 'ts4', title: 'Blank Space', artist: 'Taylor Swift', album: '1989', duration: 231 },
  { id: 'ts5', title: 'Love Story', artist: 'Taylor Swift', album: 'Fearless', duration: 236 },
  { id: 'ts6', title: 'You Belong With Me', artist: 'Taylor Swift', album: 'Fearless', duration: 231 },
  { id: 'ts7', title: 'Bad Blood', artist: 'Taylor Swift', album: '1989', duration: 211 },
  { id: 'ts8', title: 'Cardigan', artist: 'Taylor Swift', album: 'Folklore', duration: 239 },
  { id: 'ts9', title: 'Willow', artist: 'Taylor Swift', album: 'Evermore', duration: 214 },
  { id: 'ts10', title: 'All Too Well (10 Min Version)', artist: 'Taylor Swift', album: 'Red (Taylor\'s Version)', duration: 613 },
  { id: 'ts11', title: 'I Knew You Were Trouble', artist: 'Taylor Swift', album: 'Red', duration: 219 },
  { id: 'ts12', title: 'We Are Never Ever Getting Back Together', artist: 'Taylor Swift', album: 'Red', duration: 193 },
  { id: 'ts13', title: 'Wildest Dreams', artist: 'Taylor Swift', album: '1989', duration: 220 },
  { id: 'ts14', title: 'Delicate', artist: 'Taylor Swift', album: 'Reputation', duration: 232 },
  { id: 'ts15', title: 'Lavender Haze', artist: 'Taylor Swift', album: 'Midnights', duration: 202 },
  { id: 'ts16', title: 'Karma', artist: 'Taylor Swift', album: 'Midnights', duration: 204 },
  { id: 'ts17', title: 'Enchanted', artist: 'Taylor Swift', album: 'Speak Now', duration: 353 },
  { id: 'ts18', title: 'Style', artist: 'Taylor Swift', album: '1989', duration: 231 },
  { id: 'ts19', title: 'Fearless', artist: 'Taylor Swift', album: 'Fearless', duration: 241 },
  { id: 'ts20', title: 'The Man', artist: 'Taylor Swift', album: 'Lover', duration: 190 },

  // ═══════════════════════════════════════════
  // ED SHEERAN - 14 songs
  // ═══════════════════════════════════════════
  { id: 'es1', title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide', duration: 233 },
  { id: 'es2', title: 'Perfect', artist: 'Ed Sheeran', album: 'Divide', duration: 263 },
  { id: 'es3', title: 'Photograph', artist: 'Ed Sheeran', album: 'Multiply', duration: 259 },
  { id: 'es4', title: 'Thinking Out Loud', artist: 'Ed Sheeran', album: 'Multiply', duration: 281 },
  { id: 'es5', title: 'Castle on the Hill', artist: 'Ed Sheeran', album: 'Divide', duration: 261 },
  { id: 'es6', title: 'Bad Habits', artist: 'Ed Sheeran', album: 'Equals', duration: 231 },
  { id: 'es7', title: 'Shivers', artist: 'Ed Sheeran', album: 'Equals', duration: 207 },
  { id: 'es8', title: 'The A Team', artist: 'Ed Sheeran', album: 'Plus', duration: 258 },
  { id: 'es9', title: 'Lego House', artist: 'Ed Sheeran', album: 'Plus', duration: 225 },
  { id: 'es10', title: 'Galway Girl', artist: 'Ed Sheeran', album: 'Divide', duration: 170 },
  { id: 'es11', title: 'Happier', artist: 'Ed Sheeran', album: 'Divide', duration: 207 },
  { id: 'es12', title: 'Sing', artist: 'Ed Sheeran', album: 'Multiply', duration: 235 },
  { id: 'es13', title: 'Don\'t', artist: 'Ed Sheeran', album: 'Multiply', duration: 219 },
  { id: 'es14', title: 'Eyes Closed', artist: 'Ed Sheeran', album: 'Subtract', duration: 194 },

  // ═══════════════════════════════════════════
  // DRAKE - 14 songs
  // ═══════════════════════════════════════════
  { id: 'dr1', title: 'God\'s Plan', artist: 'Drake', album: 'Scorpion', duration: 198 },
  { id: 'dr2', title: 'Hotline Bling', artist: 'Drake', album: 'Views', duration: 267 },
  { id: 'dr3', title: 'One Dance', artist: 'Drake', album: 'Views', duration: 173 },
  { id: 'dr4', title: 'In My Feelings', artist: 'Drake', album: 'Scorpion', duration: 217 },
  { id: 'dr5', title: 'Started From the Bottom', artist: 'Drake', album: 'Nothing Was the Same', duration: 173 },
  { id: 'dr6', title: 'Hold On We\'re Going Home', artist: 'Drake', album: 'Nothing Was the Same', duration: 227 },
  { id: 'dr7', title: 'Nice for What', artist: 'Drake', album: 'Scorpion', duration: 210 },
  { id: 'dr8', title: 'Toosie Slide', artist: 'Drake', album: 'Dark Lane Demo Tapes', duration: 247 },
  { id: 'dr9', title: 'Laugh Now Cry Later', artist: 'Drake', album: 'Certified Lover Boy', duration: 261 },
  { id: 'dr10', title: 'Rich Flex', artist: 'Drake', album: 'Her Loss', duration: 239 },
  { id: 'dr11', title: 'Jimmy Cooks', artist: 'Drake', album: 'Honestly Nevermind', duration: 218 },
  { id: 'dr12', title: 'Passionfruit', artist: 'Drake', album: 'More Life', duration: 298 },
  { id: 'dr13', title: 'Fake Love', artist: 'Drake', album: 'More Life', duration: 210 },
  { id: 'dr14', title: 'Take Care', artist: 'Drake', album: 'Take Care', duration: 277 },

  // ═══════════════════════════════════════════
  // ADELE - 10 songs
  // ═══════════════════════════════════════════
  { id: 'ad1', title: 'Someone Like You', artist: 'Adele', album: '21', duration: 285 },
  { id: 'ad2', title: 'Rolling in the Deep', artist: 'Adele', album: '21', duration: 228 },
  { id: 'ad3', title: 'Hello', artist: 'Adele', album: '25', duration: 295 },
  { id: 'ad4', title: 'Set Fire to the Rain', artist: 'Adele', album: '21', duration: 242 },
  { id: 'ad5', title: 'Skyfall', artist: 'Adele', album: 'Skyfall Soundtrack', duration: 286 },
  { id: 'ad6', title: 'Easy on Me', artist: 'Adele', album: '30', duration: 224 },
  { id: 'ad7', title: 'When We Were Young', artist: 'Adele', album: '25', duration: 290 },
  { id: 'ad8', title: 'Chasing Pavements', artist: 'Adele', album: '19', duration: 210 },
  { id: 'ad9', title: 'Rumour Has It', artist: 'Adele', album: '21', duration: 223 },
  { id: 'ad10', title: 'Oh My God', artist: 'Adele', album: '30', duration: 225 },

  // ═══════════════════════════════════════════
  // BRUNO MARS - 12 songs
  // ═══════════════════════════════════════════
  { id: 'bm1', title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Doo-Wops & Hooligans', duration: 270 },
  { id: 'bm2', title: 'Just the Way You Are', artist: 'Bruno Mars', album: 'Doo-Wops & Hooligans', duration: 220 },
  { id: 'bm3', title: 'Grenade', artist: 'Bruno Mars', album: 'Doo-Wops & Hooligans', duration: 222 },
  { id: 'bm4', title: 'Locked Out of Heaven', artist: 'Bruno Mars', album: 'Unorthodox Jukebox', duration: 233 },
  { id: 'bm5', title: 'When I Was Your Man', artist: 'Bruno Mars', album: 'Unorthodox Jukebox', duration: 213 },
  { id: 'bm6', title: '24K Magic', artist: 'Bruno Mars', album: '24K Magic', duration: 225 },
  { id: 'bm7', title: 'That\'s What I Like', artist: 'Bruno Mars', album: '24K Magic', duration: 206 },
  { id: 'bm8', title: 'Treasure', artist: 'Bruno Mars', album: 'Unorthodox Jukebox', duration: 178 },
  { id: 'bm9', title: 'Leave the Door Open', artist: 'Bruno Mars', album: 'An Evening with Silk Sonic', duration: 242 },
  { id: 'bm10', title: 'Die With a Smile', artist: 'Bruno Mars', album: 'Single', duration: 251 },
  { id: 'bm11', title: 'Marry You', artist: 'Bruno Mars', album: 'Doo-Wops & Hooligans', duration: 230 },
  { id: 'bm12', title: 'The Lazy Song', artist: 'Bruno Mars', album: 'Doo-Wops & Hooligans', duration: 188 },

  // ═══════════════════════════════════════════
  // THE WEEKND - 12 songs
  // ═══════════════════════════════════════════
  { id: 'tw1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200 },
  { id: 'tw2', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration: 215 },
  { id: 'tw3', title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: 230 },
  { id: 'tw4', title: 'The Hills', artist: 'The Weeknd', album: 'Beauty Behind the Madness', duration: 242 },
  { id: 'tw5', title: 'Can\'t Feel My Face', artist: 'The Weeknd', album: 'Beauty Behind the Madness', duration: 213 },
  { id: 'tw6', title: 'I Feel It Coming', artist: 'The Weeknd', album: 'Starboy', duration: 269 },
  { id: 'tw7', title: 'Heartless', artist: 'The Weeknd', album: 'After Hours', duration: 201 },
  { id: 'tw8', title: 'Call Out My Name', artist: 'The Weeknd', album: 'My Dear Melancholy', duration: 228 },
  { id: 'tw9', title: 'Die For You', artist: 'The Weeknd', album: 'Starboy', duration: 260 },
  { id: 'tw10', title: 'Popular', artist: 'The Weeknd', album: 'The Idol', duration: 235 },
  { id: 'tw11', title: 'Creepin\'', artist: 'The Weeknd', album: 'Heroes & Villains', duration: 221 },
  { id: 'tw12', title: 'In Your Eyes', artist: 'The Weeknd', album: 'After Hours', duration: 237 },

  // ═══════════════════════════════════════════
  // DUO LIPA - 10 songs
  // ═══════════════════════════════════════════
  { id: 'dl1', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 203 },
  { id: 'dl2', title: 'Don\'t Start Now', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 183 },
  { id: 'dl3', title: 'New Rules', artist: 'Dua Lipa', album: 'Dua Lipa', duration: 209 },
  { id: 'dl4', title: 'Physical', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 193 },
  { id: 'dl5', title: 'Break My Heart', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 221 },
  { id: 'dl6', title: 'Love Again', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 258 },
  { id: 'dl7', title: 'IDGAF', artist: 'Dua Lipa', album: 'Dua Lipa', duration: 217 },
  { id: 'dl8', title: 'Be the One', artist: 'Dua Lipa', album: 'Dua Lipa', duration: 203 },
  { id: 'dl9', title: 'Houdini', artist: 'Dua Lipa', album: 'Radical Optimism', duration: 185 },
  { id: 'dl10', title: 'Training Season', artist: 'Dua Lipa', album: 'Radical Optimism', duration: 209 },

  // ═══════════════════════════════════════════
  // COLDPLAY - 12 songs
  // ═══════════════════════════════════════════
  { id: 'cp1', title: 'Yellow', artist: 'Coldplay', album: 'Parachutes', duration: 266 },
  { id: 'cp2', title: 'Fix You', artist: 'Coldplay', album: 'X&Y', duration: 295 },
  { id: 'cp3', title: 'Viva la Vida', artist: 'Coldplay', album: 'Viva la Vida', duration: 242 },
  { id: 'cp4', title: 'The Scientist', artist: 'Coldplay', album: 'A Rush of Blood to the Head', duration: 269 },
  { id: 'cp5', title: 'Clocks', artist: 'Coldplay', album: 'A Rush of Blood to the Head', duration: 247 },
  { id: 'cp6', title: 'Something Just Like This', artist: 'Coldplay', album: 'Memories', duration: 247 },
  { id: 'cp7', title: 'Paradise', artist: 'Coldplay', album: 'Mylo Xyloto', duration: 278 },
  { id: 'cp8', title: 'My Universe', artist: 'Coldplay', album: 'Music of the Spheres', duration: 226 },
  { id: 'cp9', title: 'A Sky Full of Stars', artist: 'Coldplay', album: 'Ghost Stories', duration: 268 },
  { id: 'cp10', title: 'Hymn for the Weekend', artist: 'Coldplay', album: 'A Head Full of Dreams', duration: 258 },
  { id: 'cp11', title: 'Adventure of a Lifetime', artist: 'Coldplay', album: 'A Head Full of Dreams', duration: 263 },
  { id: 'cp12', title: 'Sparks', artist: 'Coldplay', album: 'Parachutes', duration: 227 },

  // ═══════════════════════════════════════════
  // BILLIE EILISH - 10 songs
  // ═══════════════════════════════════════════
  { id: 'be1', title: 'bad guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep', duration: 194 },
  { id: 'be2', title: 'Happier Than Ever', artist: 'Billie Eilish', album: 'Happier Than Ever', duration: 358 },
  { id: 'be3', title: 'Everything I Wanted', artist: 'Billie Eilish', album: 'Single', duration: 245 },
  { id: 'be4', title: 'Lovely', artist: 'Billie Eilish', album: 'Single', duration: 200 },
  { id: 'be5', title: 'Ocean Eyes', artist: 'Billie Eilish', album: 'Don\'t Smile at Me', duration: 200 },
  { id: 'be6', title: 'No Time to Die', artist: 'Billie Eilish', album: 'No Time to Die Soundtrack', duration: 242 },
  { id: 'be7', title: 'Therefore I Am', artist: 'Billie Eilish', album: 'Happier Than Ever', duration: 174 },
  { id: 'be8', title: 'Bellyache', artist: 'Billie Eilish', album: 'Don\'t Smile at Me', duration: 179 },
  { id: 'be9', title: 'idontwannabeyouanymore', artist: 'Billie Eilish', album: 'Don\'t Smile at Me', duration: 203 },
  { id: 'be10', title: 'What Was I Made For?', artist: 'Billie Eilish', album: 'Barbie Soundtrack', duration: 222 },

  // ═══════════════════════════════════════════
  // BEYONCE - 10 songs
  // ═══════════════════════════════════════════
  { id: 'by1', title: 'Halo', artist: 'Beyonce', album: 'I Am... Sasha Fierce', duration: 264 },
  { id: 'by2', title: 'Single Ladies', artist: 'Beyonce', album: 'I Am... Sasha Fierce', duration: 193 },
  { id: 'by3', title: 'Crazy in Love', artist: 'Beyonce', album: 'Dangerously in Love', duration: 236 },
  { id: 'by4', title: 'Irreplaceable', artist: 'Beyonce', album: 'B\'Day', duration: 227 },
  { id: 'by5', title: 'Run the World', artist: 'Beyonce', album: '4', duration: 236 },
  { id: 'by6', title: 'Formation', artist: 'Beyonce', album: 'Lemonade', duration: 206 },
  { id: 'by7', title: 'Drunk in Love', artist: 'Beyonce', album: 'Beyonce', duration: 323 },
  { id: 'by8', title: 'Love on Top', artist: 'Beyonce', album: '4', duration: 267 },
  { id: 'by9', title: 'Break My Soul', artist: 'Beyonce', album: 'Renaissance', duration: 298 },
  { id: 'by10', title: 'Texas Hold \'Em', artist: 'Beyonce', album: 'Cowboy Carter', duration: 233 },

  // ═══════════════════════════════════════════
  // RIHANNA - 10 songs
  // ═══════════════════════════════════════════
  { id: 'rh1', title: 'Umbrella', artist: 'Rihanna', album: 'Good Girl Gone Bad', duration: 275 },
  { id: 'rh2', title: 'We Found Love', artist: 'Rihanna', album: 'Talk That Talk', duration: 215 },
  { id: 'rh3', title: 'Diamonds', artist: 'Rihanna', album: 'Unapologetic', duration: 225 },
  { id: 'rh4', title: 'Stay', artist: 'Rihanna', album: 'Unapologetic', duration: 240 },
  { id: 'rh5', title: 'Only Girl', artist: 'Rihanna', album: 'Loud', duration: 235 },
  { id: 'rh6', title: 'S&M', artist: 'Rihanna', album: 'Loud', duration: 244 },
  { id: 'rh7', title: 'Work', artist: 'Rihanna', album: 'Anti', duration: 219 },
  { id: 'rh8', title: 'Love the Way You Lie', artist: 'Rihanna', album: 'Recovery', duration: 263 },
  { id: 'rh9', title: 'Don\'t Stop the Music', artist: 'Rihanna', album: 'Good Girl Gone Bad', duration: 227 },
  { id: 'rh10', title: 'Where Have You Been', artist: 'Rihanna', album: 'Talk That Talk', duration: 242 },

  // ═══════════════════════════════════════════
  // MICHAEL JACKSON - 12 songs
  // ═══════════════════════════════════════════
  { id: 'mj1', title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', duration: 294 },
  { id: 'mj2', title: 'Thriller', artist: 'Michael Jackson', album: 'Thriller', duration: 357 },
  { id: 'mj3', title: 'Beat It', artist: 'Michael Jackson', album: 'Thriller', duration: 258 },
  { id: 'mj4', title: 'Bad', artist: 'Michael Jackson', album: 'Bad', duration: 247 },
  { id: 'mj5', title: 'Smooth Criminal', artist: 'Michael Jackson', album: 'Bad', duration: 273 },
  { id: 'mj6', title: 'Man in the Mirror', artist: 'Michael Jackson', album: 'Bad', duration: 315 },
  { id: 'mj7', title: 'Black or White', artist: 'Michael Jackson', album: 'Dangerous', duration: 273 },
  { id: 'mj8', title: 'Remember the Time', artist: 'Michael Jackson', album: 'Dangerous', duration: 239 },
  { id: 'mj9', title: 'Heal the World', artist: 'Michael Jackson', album: 'Dangerous', duration: 385 },
  { id: 'mj10', title: 'Don\'t Stop \'Til You Get Enough', artist: 'Michael Jackson', album: 'Off the Wall', duration: 364 },
  { id: 'mj11', title: 'Rock With You', artist: 'Michael Jackson', album: 'Off the Wall', duration: 220 },
  { id: 'mj12', title: 'They Don\'t Care About Us', artist: 'Michael Jackson', album: 'HIStory', duration: 284 },

  // ═══════════════════════════════════════════
  // ARIANA GRANDE - 12 songs
  // ═══════════════════════════════════════════
  { id: 'ag1', title: 'Thank U Next', artist: 'Ariana Grande', album: 'Thank U Next', duration: 207 },
  { id: 'ag2', title: '7 Rings', artist: 'Ariana Grande', album: 'Thank U Next', duration: 178 },
  { id: 'ag3', title: 'Into You', artist: 'Ariana Grande', album: 'Dangerous Woman', duration: 264 },
  { id: 'ag4', title: 'Side to Side', artist: 'Ariana Grande', album: 'Dangerous Woman', duration: 226 },
  { id: 'ag5', title: 'Problem', artist: 'Ariana Grande', album: 'My Everything', duration: 194 },
  { id: 'ag6', title: 'Break Free', artist: 'Ariana Grande', album: 'My Everything', duration: 214 },
  { id: 'ag7', title: 'Bang Bang', artist: 'Ariana Grande', album: 'My Everything', duration: 191 },
  { id: 'ag8', title: 'No Tears Left to Cry', artist: 'Ariana Grande', album: 'Sweetener', duration: 205 },
  { id: 'ag9', title: 'God Is a Woman', artist: 'Ariana Grande', album: 'Sweetener', duration: 197 },
  { id: 'ag10', title: 'One Last Time', artist: 'Ariana Grande', album: 'My Everything', duration: 197 },
  { id: 'ag11', title: 'Positions', artist: 'Ariana Grande', album: 'Positions', duration: 172 },
  { id: 'ag12', title: 'Love Me Harder', artist: 'Ariana Grande', album: 'My Everything', duration: 236 },

  // ═══════════════════════════════════════════
  // EMINEM - 10 songs
  // ═══════════════════════════════════════════
  { id: 'em1', title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', duration: 326 },
  { id: 'em2', title: 'Love the Way You Lie', artist: 'Eminem', album: 'Recovery', duration: 263 },
  { id: 'em3', title: 'Not Afraid', artist: 'Eminem', album: 'Recovery', duration: 250 },
  { id: 'em4', title: 'Without Me', artist: 'Eminem', album: 'The Eminem Show', duration: 290 },
  { id: 'em5', title: 'The Real Slim Shady', artist: 'Eminem', album: 'The Marshall Mathers LP', duration: 284 },
  { id: 'em6', title: 'Stan', artist: 'Eminem', album: 'The Marshall Mathers LP', duration: 404 },
  { id: 'em7', title: 'Rap God', artist: 'Eminem', album: 'The Marshall Mathers LP 2', duration: 368 },
  { id: 'em8', title: 'Mockingbird', artist: 'Eminem', album: 'Encore', duration: 250 },
  { id: 'em9', title: 'Till I Collapse', artist: 'Eminem', album: 'The Eminem Show', duration: 297 },
  { id: 'em10', title: 'Godzilla', artist: 'Eminem', album: 'Music to Be Murdered By', duration: 210 },

  // ═══════════════════════════════════════════
  // IMAGINE DRAGONS - 10 songs
  // ═══════════════════════════════════════════
  { id: 'id1', title: 'Radioactive', artist: 'Imagine Dragons', album: 'Night Visions', duration: 187 },
  { id: 'id2', title: 'Believer', artist: 'Imagine Dragons', album: 'Evolve', duration: 204 },
  { id: 'id3', title: 'Thunder', artist: 'Imagine Dragons', album: 'Evolve', duration: 187 },
  { id: 'id4', title: 'Demons', artist: 'Imagine Dragons', album: 'Night Visions', duration: 175 },
  { id: 'id5', title: 'Whatever It Takes', artist: 'Imagine Dragons', album: 'Evolve', duration: 201 },
  { id: 'id6', title: 'Natural', artist: 'Imagine Dragons', album: 'Origins', duration: 189 },
  { id: 'id7', title: 'On Top of the World', artist: 'Imagine Dragons', album: 'Night Visions', duration: 192 },
  { id: 'id8', title: 'It\'s Time', artist: 'Imagine Dragons', album: 'Night Visions', duration: 237 },
  { id: 'id9', title: 'Bad Liar', artist: 'Imagine Dragons', album: 'Origins', duration: 260 },
  { id: 'id10', title: 'Bones', artist: 'Imagine Dragons', album: 'Mercury Act 2', duration: 165 },

  // ═══════════════════════════════════════════
  // POST MALONE - 10 songs
  // ═══════════════════════════════════════════
  { id: 'pm1', title: 'Rockstar', artist: 'Post Malone', album: 'Beerbongs & Bentleys', duration: 218 },
  { id: 'pm2', title: 'Circles', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', duration: 215 },
  { id: 'pm3', title: 'Sunflower', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', duration: 158 },
  { id: 'pm4', title: 'Congratulations', artist: 'Post Malone', album: 'Stoney', duration: 220 },
  { id: 'pm5', title: 'Better Now', artist: 'Post Malone', album: 'Beerbongs & Bentleys', duration: 231 },
  { id: 'pm6', title: 'White Iverson', artist: 'Post Malone', album: 'Stoney', duration: 256 },
  { id: 'pm7', title: 'Goodbyes', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', duration: 234 },
  { id: 'pm8', title: 'Psycho', artist: 'Post Malone', album: 'Beerbongs & Bentleys', duration: 221 },
  { id: 'pm9', title: 'Wow', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', duration: 149 },
  { id: 'pm10', title: 'I Like You', artist: 'Post Malone', album: 'Twelve Carat Toothache', duration: 192 },

  // ═══════════════════════════════════════════
  // LADY GAGA - 10 songs
  // ═══════════════════════════════════════════
  { id: 'lg1', title: 'Bad Romance', artist: 'Lady Gaga', album: 'The Fame Monster', duration: 294 },
  { id: 'lg2', title: 'Poker Face', artist: 'Lady Gaga', album: 'The Fame', duration: 237 },
  { id: 'lg3', title: 'Shallow', artist: 'Lady Gaga', album: 'A Star Is Born', duration: 215 },
  { id: 'lg4', title: 'Just Dance', artist: 'Lady Gaga', album: 'The Fame', duration: 242 },
  { id: 'lg5', title: 'Born This Way', artist: 'Lady Gaga', album: 'Born This Way', duration: 260 },
  { id: 'lg6', title: 'Alejandro', artist: 'Lady Gaga', album: 'The Fame Monster', duration: 274 },
  { id: 'lg7', title: 'Telephone', artist: 'Lady Gaga', album: 'The Fame Monster', duration: 220 },
  { id: 'lg8', title: 'Applause', artist: 'Lady Gaga', album: 'Artpop', duration: 212 },
  { id: 'lg9', title: 'Million Reasons', artist: 'Lady Gaga', album: 'Joanne', duration: 205 },
  { id: 'lg10', title: 'Rain on Me', artist: 'Lady Gaga', album: 'Chromatica', duration: 182 },

  // ═══════════════════════════════════════════
  // KATY PERRY - 10 songs
  // ═══════════════════════════════════════════
  { id: 'kp1', title: 'Firework', artist: 'Katy Perry', album: 'Teenage Dream', duration: 227 },
  { id: 'kp2', title: 'Roar', artist: 'Katy Perry', album: 'Prism', duration: 223 },
  { id: 'kp3', title: 'Dark Horse', artist: 'Katy Perry', album: 'Prism', duration: 215 },
  { id: 'kp4', title: 'Teenage Dream', artist: 'Katy Perry', album: 'Teenage Dream', duration: 227 },
  { id: 'kp5', title: 'California Gurls', artist: 'Katy Perry', album: 'Teenage Dream', duration: 224 },
  { id: 'kp6', title: 'Hot N Cold', artist: 'Katy Perry', album: 'One of the Boys', duration: 220 },
  { id: 'kp7', title: 'I Kissed a Girl', artist: 'Katy Perry', album: 'One of the Boys', duration: 179 },
  { id: 'kp8', title: 'E.T.', artist: 'Katy Perry', album: 'Teenage Dream', duration: 210 },
  { id: 'kp9', title: 'Last Friday Night', artist: 'Katy Perry', album: 'Teenage Dream', duration: 227 },
  { id: 'kp10', title: 'Never Really Over', artist: 'Katy Perry', album: 'Smile', duration: 223 },

  // ═══════════════════════════════════════════
  // HARRY STYLES - 10 songs
  // ═══════════════════════════════════════════
  { id: 'hs1', title: 'As It Was', artist: 'Harry Styles', album: 'Harry\'s House', duration: 167 },
  { id: 'hs2', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: 174 },
  { id: 'hs3', title: 'Adore You', artist: 'Harry Styles', album: 'Fine Line', duration: 207 },
  { id: 'hs4', title: 'Sign of the Times', artist: 'Harry Styles', album: 'Harry Styles', duration: 340 },
  { id: 'hs5', title: 'Falling', artist: 'Harry Styles', album: 'Fine Line', duration: 240 },
  { id: 'hs6', title: 'Late Night Talking', artist: 'Harry Styles', album: 'Harry\'s House', duration: 177 },
  { id: 'hs7', title: 'Golden', artist: 'Harry Styles', album: 'Fine Line', duration: 208 },
  { id: 'hs8', title: 'Lights Up', artist: 'Harry Styles', album: 'Fine Line', duration: 172 },
  { id: 'hs9', title: 'Kiwi', artist: 'Harry Styles', album: 'Harry Styles', duration: 176 },
  { id: 'hs10', title: 'Satellite', artist: 'Harry Styles', album: 'Harry\'s House', duration: 238 },

  // ═══════════════════════════════════════════
  // MAROON 5 - 10 songs
  // ═══════════════════════════════════════════
  { id: 'm5_1', title: 'Sugar', artist: 'Maroon 5', album: 'V', duration: 235 },
  { id: 'm5_2', title: 'Girls Like You', artist: 'Maroon 5', album: 'Red Pill Blues', duration: 235 },
  { id: 'm5_3', title: 'Moves Like Jagger', artist: 'Maroon 5', album: 'Hands All Over', duration: 221 },
  { id: 'm5_4', title: 'Payphone', artist: 'Maroon 5', album: 'Overexposed', duration: 231 },
  { id: 'm5_5', title: 'She Will Be Loved', artist: 'Maroon 5', album: 'Songs About Jane', duration: 256 },
  { id: 'm5_6', title: 'One More Night', artist: 'Maroon 5', album: 'Overexposed', duration: 219 },
  { id: 'm5_7', title: 'Animals', artist: 'Maroon 5', album: 'V', duration: 231 },
  { id: 'm5_8', title: 'Maps', artist: 'Maroon 5', album: 'V', duration: 190 },
  { id: 'm5_9', title: 'Don\'t Wanna Know', artist: 'Maroon 5', album: 'Red Pill Blues', duration: 214 },
  { id: 'm5_10', title: 'This Love', artist: 'Maroon 5', album: 'Songs About Jane', duration: 206 },

  // ═══════════════════════════════════════════
  // QUEEN - 8 songs
  // ═══════════════════════════════════════════
  { id: 'qu1', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: 355 },
  { id: 'qu2', title: 'We Will Rock You', artist: 'Queen', album: 'News of the World', duration: 122 },
  { id: 'qu3', title: 'We Are the Champions', artist: 'Queen', album: 'News of the World', duration: 179 },
  { id: 'qu4', title: 'Don\'t Stop Me Now', artist: 'Queen', album: 'Jazz', duration: 209 },
  { id: 'qu5', title: 'Another One Bites the Dust', artist: 'Queen', album: 'The Game', duration: 215 },
  { id: 'qu6', title: 'Under Pressure', artist: 'Queen', album: 'Hot Space', duration: 248 },
  { id: 'qu7', title: 'Somebody to Love', artist: 'Queen', album: 'A Day at the Races', duration: 296 },
  { id: 'qu8', title: 'Crazy Little Thing Called Love', artist: 'Queen', album: 'The Game', duration: 162 },

  // ═══════════════════════════════════════════
  // JUSTIN BIEBER - 10 songs
  // ═══════════════════════════════════════════
  { id: 'jb1', title: 'Stay', artist: 'Justin Bieber', album: 'Justice', duration: 141 },
  { id: 'jb2', title: 'Sorry', artist: 'Justin Bieber', album: 'Purpose', duration: 200 },
  { id: 'jb3', title: 'Love Yourself', artist: 'Justin Bieber', album: 'Purpose', duration: 233 },
  { id: 'jb4', title: 'What Do You Mean?', artist: 'Justin Bieber', album: 'Purpose', duration: 206 },
  { id: 'jb5', title: 'Baby', artist: 'Justin Bieber', album: 'My World 2.0', duration: 214 },
  { id: 'jb6', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', duration: 198 },
  { id: 'jb7', title: 'Ghost', artist: 'Justin Bieber', album: 'Justice', duration: 153 },
  { id: 'jb8', title: 'Intentions', artist: 'Justin Bieber', album: 'Changes', duration: 207 },
  { id: 'jb9', title: 'Yummy', artist: 'Justin Bieber', album: 'Changes', duration: 209 },
  { id: 'jb10', title: 'Never Say Never', artist: 'Justin Bieber', album: 'Never Say Never', duration: 227 },

  // ═══════════════════════════════════════════
  // DOJA CAT - 8 songs
  // ═══════════════════════════════════════════
  { id: 'dc1', title: 'Say So', artist: 'Doja Cat', album: 'Hot Pink', duration: 237 },
  { id: 'dc2', title: 'Kiss Me More', artist: 'Doja Cat', album: 'Planet Her', duration: 208 },
  { id: 'dc3', title: 'Need to Know', artist: 'Doja Cat', album: 'Planet Her', duration: 210 },
  { id: 'dc4', title: 'Woman', artist: 'Doja Cat', album: 'Planet Her', duration: 172 },
  { id: 'dc5', title: 'Paint the Town Red', artist: 'Doja Cat', album: 'Scarlet', duration: 231 },
  { id: 'dc6', title: 'Streets', artist: 'Doja Cat', album: 'Hot Pink', duration: 226 },
  { id: 'dc7', title: 'Juicy', artist: 'Doja Cat', album: 'Hot Pink', duration: 215 },
  { id: 'dc8', title: 'Get Into It (Yuh)', artist: 'Doja Cat', album: 'Planet Her', duration: 138 },

  // ═══════════════════════════════════════════
  // ELTON JOHN - 8 songs
  // ═══════════════════════════════════════════
  { id: 'ej1', title: 'Your Song', artist: 'Elton John', album: 'Elton John', duration: 242 },
  { id: 'ej2', title: 'Rocket Man', artist: 'Elton John', album: 'Honky Chateau', duration: 281 },
  { id: 'ej3', title: 'Tiny Dancer', artist: 'Elton John', album: 'Madman Across the Water', duration: 317 },
  { id: 'ej4', title: 'Crocodile Rock', artist: 'Elton John', album: 'Don\'t Shoot Me I\'m Only the Piano Player', duration: 235 },
  { id: 'ej5', title: 'I\'m Still Standing', artist: 'Elton John', album: 'Too Low for Zero', duration: 183 },
  { id: 'ej6', title: 'Bennie and the Jets', artist: 'Elton John', album: 'Goodbye Yellow Brick Road', duration: 322 },
  { id: 'ej7', title: 'Goodbye Yellow Brick Road', artist: 'Elton John', album: 'Goodbye Yellow Brick Road', duration: 314 },
  { id: 'ej8', title: 'Cold Heart', artist: 'Elton John', album: 'The Lockdown Sessions', duration: 203 },

  // ═══════════════════════════════════════════
  // OLIVA RODRIGO - 8 songs
  // ═══════════════════════════════════════════
  { id: 'or1', title: 'Drivers License', artist: 'Olivia Rodrigo', album: 'Sour', duration: 242 },
  { id: 'or2', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'Sour', duration: 178 },
  { id: 'or3', title: 'Deja Vu', artist: 'Olivia Rodrigo', album: 'Sour', duration: 215 },
  { id: 'or4', title: 'Traitor', artist: 'Olivia Rodrigo', album: 'Sour', duration: 229 },
  { id: 'or5', title: 'Brutal', artist: 'Olivia Rodrigo', album: 'Sour', duration: 143 },
  { id: 'or6', title: 'Vampire', artist: 'Olivia Rodrigo', album: 'Guts', duration: 219 },
  { id: 'or7', title: 'Bad Idea Right?', artist: 'Olivia Rodrigo', album: 'Guts', duration: 184 },
  { id: 'or8', title: 'Get Him Back!', artist: 'Olivia Rodrigo', album: 'Guts', duration: 191 },

  // ═══════════════════════════════════════════
  // SHAWN MENDES - 8 songs
  // ═══════════════════════════════════════════
  { id: 'sm1', title: 'Señorita', artist: 'Shawn Mendes', album: 'Single', duration: 190 },
  { id: 'sm2', title: 'Stitches', artist: 'Shawn Mendes', album: 'Handwritten', duration: 206 },
  { id: 'sm3', title: 'Treat You Better', artist: 'Shawn Mendes', album: 'Illuminate', duration: 187 },
  { id: 'sm4', title: 'There\'s Nothing Holdin\' Me Back', artist: 'Shawn Mendes', album: 'Illuminate', duration: 199 },
  { id: 'sm5', title: 'In My Blood', artist: 'Shawn Mendes', album: 'Shawn Mendes', duration: 211 },
  { id: 'sm6', title: 'Mercy', artist: 'Shawn Mendes', album: 'Illuminate', duration: 208 },
  { id: 'sm7', title: 'Lost in Japan', artist: 'Shawn Mendes', album: 'Shawn Mendes', duration: 201 },
  { id: 'sm8', title: 'If I Can\'t Have You', artist: 'Shawn Mendes', album: 'Shawn Mendes', duration: 190 },

  // ═══════════════════════════════════════════
  // KENDRICK LAMAR - 8 songs
  // ═══════════════════════════════════════════
  { id: 'kl1', title: 'HUMBLE', artist: 'Kendrick Lamar', album: 'DAMN', duration: 177 },
  { id: 'kl2', title: 'DNA', artist: 'Kendrick Lamar', album: 'DAMN', duration: 185 },
  { id: 'kl3', title: 'Alright', artist: 'Kendrick Lamar', album: 'To Pimp a Butterfly', duration: 219 },
  { id: 'kl4', title: 'Swimming Pools', artist: 'Kendrick Lamar', album: 'good kid m.A.A.d city', duration: 255 },
  { id: 'kl5', title: 'Money Trees', artist: 'Kendrick Lamar', album: 'good kid m.A.A.d city', duration: 386 },
  { id: 'kl6', title: 'LOVE', artist: 'Kendrick Lamar', album: 'DAMN', duration: 213 },
  { id: 'kl7', title: 'Not Like Us', artist: 'Kendrick Lamar', album: 'Single', duration: 274 },
  { id: 'kl8', title: 'The Heart Part 5', artist: 'Kendrick Lamar', album: 'Single', duration: 332 },

  // ═══════════════════════════════════════════
  // SZA - 8 songs
  // ═══════════════════════════════════════════
  { id: 'sz1', title: 'Kill Bill', artist: 'SZA', album: 'SOS', duration: 213 },
  { id: 'sz2', title: 'Snooze', artist: 'SZA', album: 'SOS', duration: 201 },
  { id: 'sz3', title: 'Good Days', artist: 'SZA', album: 'SOS', duration: 278 },
  { id: 'sz4', title: 'I Hate U', artist: 'SZA', album: 'SOS', duration: 175 },
  { id: 'sz5', title: 'Love Galore', artist: 'SZA', album: 'Ctrl', duration: 275 },
  { id: 'sz6', title: 'The Weekend', artist: 'SZA', album: 'Ctrl', duration: 272 },
  { id: 'sz7', title: 'Broken Clocks', artist: 'SZA', album: 'Ctrl', duration: 231 },
  { id: 'sz8', title: 'Drew Barrymore', artist: 'SZA', album: 'Ctrl', duration: 231 },

  // ═══════════════════════════════════════════
  // ONE DIRECTION - 6 songs
  // ═══════════════════════════════════════════
  { id: 'od1', title: 'What Makes You Beautiful', artist: 'One Direction', album: 'Up All Night', duration: 199 },
  { id: 'od2', title: 'Story of My Life', artist: 'One Direction', album: 'Midnight Memories', duration: 245 },
  { id: 'od3', title: 'Drag Me Down', artist: 'One Direction', album: 'Made in the A.M.', duration: 192 },
  { id: 'od4', title: 'Steal My Girl', artist: 'One Direction', album: 'Four', duration: 228 },
  { id: 'od5', title: 'Best Song Ever', artist: 'One Direction', album: 'Midnight Memories', duration: 202 },
  { id: 'od6', title: 'Night Changes', artist: 'One Direction', album: 'Four', duration: 226 },

  // ═══════════════════════════════════════════
  // WHITNEY HOUSTON - 6 songs
  // ═══════════════════════════════════════════
  { id: 'wh1', title: 'I Will Always Love You', artist: 'Whitney Houston', album: 'The Bodyguard', duration: 271 },
  { id: 'wh2', title: 'I Wanna Dance With Somebody', artist: 'Whitney Houston', album: 'Whitney', duration: 291 },
  { id: 'wh3', title: 'Greatest Love of All', artist: 'Whitney Houston', album: 'Whitney Houston', duration: 287 },
  { id: 'wh4', title: 'How Will I Know', artist: 'Whitney Houston', album: 'Whitney Houston', duration: 275 },
  { id: 'wh5', title: 'Where Do Broken Hearts Go', artist: 'Whitney Houston', album: 'Whitney', duration: 269 },
  { id: 'wh6', title: 'I Have Nothing', artist: 'Whitney Houston', album: 'The Bodyguard', duration: 289 },

  // ═══════════════════════════════════════════
  // MILEY CYRUS - 8 songs
  // ═══════════════════════════════════════════
  { id: 'mc1', title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', duration: 200 },
  { id: 'mc2', title: 'Wrecking Ball', artist: 'Miley Cyrus', album: 'Bangerz', duration: 221 },
  { id: 'mc3', title: 'Party in the USA', artist: 'Miley Cyrus', album: 'The Time of Our Lives', duration: 202 },
  { id: 'mc4', title: 'We Can\'t Stop', artist: 'Miley Cyrus', album: 'Bangerz', duration: 231 },
  { id: 'mc5', title: 'Malibu', artist: 'Miley Cyrus', album: 'Younger Now', duration: 231 },
  { id: 'mc6', title: 'Used to Be Young', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', duration: 191 },
  { id: 'mc7', title: 'Midnight Sky', artist: 'Miley Cyrus', album: 'Plastic Hearts', duration: 223 },
  { id: 'mc8', title: 'Angels Like You', artist: 'Miley Cyrus', album: 'Plastic Hearts', duration: 222 },

  // ═══════════════════════════════════════════
  // SAM SMITH - 8 songs
  // ═══════════════════════════════════════════
  { id: 'ss1', title: 'Stay With Me', artist: 'Sam Smith', album: 'In the Lonely Hour', duration: 232 },
  { id: 'ss2', title: 'Too Good at Goodbyes', artist: 'Sam Smith', album: 'The Thrill of It All', duration: 201 },
  { id: 'ss3', title: 'I\'m Not the Only One', artist: 'Sam Smith', album: 'In the Lonely Hour', duration: 239 },
  { id: 'ss4', title: 'Lay Me Down', artist: 'Sam Smith', album: 'In the Lonely Hour', duration: 219 },
  { id: 'ss5', title: 'Writing\'s on the Wall', artist: 'Sam Smith', album: 'Spectre Soundtrack', duration: 278 },
  { id: 'ss6', title: 'Unholy', artist: 'Sam Smith', album: 'Gloria', duration: 156 },
  { id: 'ss7', title: 'Like I Can', artist: 'Sam Smith', album: 'In the Lonely Hour', duration: 227 },
  { id: 'ss8', title: 'Money on My Mind', artist: 'Sam Smith', album: 'In the Lonely Hour', duration: 196 },

  // ═══════════════════════════════════════════
  // CHARLIE PUTH - 8 songs
  // ═══════════════════════════════════════════
  { id: 'cp_1', title: 'Attention', artist: 'Charlie Puth', album: 'Voicenotes', duration: 208 },
  { id: 'cp_2', title: 'We Don\'t Talk Anymore', artist: 'Charlie Puth', album: 'Nine Track Mind', duration: 217 },
  { id: 'cp_3', title: 'See You Again', artist: 'Charlie Puth', album: 'Furious 7 Soundtrack', duration: 229 },
  { id: 'cp_4', title: 'One Call Away', artist: 'Charlie Puth', album: 'Nine Track Mind', duration: 192 },
  { id: 'cp_5', title: 'How Long', artist: 'Charlie Puth', album: 'Voicenotes', duration: 200 },
  { id: 'cp_6', title: 'Left and Right', artist: 'Charlie Puth', album: 'Charlie', duration: 154 },
  { id: 'cp_7', title: 'Light Switch', artist: 'Charlie Puth', album: 'Charlie', duration: 185 },
  { id: 'cp_8', title: 'That\'s Hilarious', artist: 'Charlie Puth', album: 'Charlie', duration: 144 },

  // ═══════════════════════════════════════════
  // ONEREPUBLIC - 8 songs
  // ═══════════════════════════════════════════
  { id: 'or_1', title: 'Counting Stars', artist: 'OneRepublic', album: 'Native', duration: 257 },
  { id: 'or_2', title: 'Apologize', artist: 'OneRepublic', album: 'Dreaming Out Loud', duration: 208 },
  { id: 'or_3', title: 'Secrets', artist: 'OneRepublic', album: 'Waking Up', duration: 224 },
  { id: 'or_4', title: 'Stop and Stare', artist: 'OneRepublic', album: 'Dreaming Out Loud', duration: 213 },
  { id: 'or_5', title: 'Good Life', artist: 'OneRepublic', album: 'Waking Up', duration: 253 },
  { id: 'or_6', title: 'I Lived', artist: 'OneRepublic', album: 'Native', duration: 234 },
  { id: 'or_7', title: 'Love Runs Out', artist: 'OneRepublic', album: 'Native', duration: 224 },
  { id: 'or_8', title: 'I Ain\'t Worried', artist: 'OneRepublic', album: 'Top Gun Maverick', duration: 148 },

  // ═══════════════════════════════════════════
  // LINKIN PARK - 8 songs
  // ═══════════════════════════════════════════
  { id: 'lp1', title: 'In the End', artist: 'Linkin Park', album: 'Hybrid Theory', duration: 216 },
  { id: 'lp2', title: 'Numb', artist: 'Linkin Park', album: 'Meteora', duration: 187 },
  { id: 'lp3', title: 'Crawling', artist: 'Linkin Park', album: 'Hybrid Theory', duration: 209 },
  { id: 'lp4', title: 'Breaking the Habit', artist: 'Linkin Park', album: 'Meteora', duration: 196 },
  { id: 'lp5', title: 'What I\'ve Done', artist: 'Linkin Park', album: 'Minutes to Midnight', duration: 205 },
  { id: 'lp6', title: 'New Divide', artist: 'Linkin Park', album: 'Transformers 2', duration: 269 },
  { id: 'lp7', title: 'Faint', artist: 'Linkin Park', album: 'Meteora', duration: 162 },
  { id: 'lp8', title: 'One Step Closer', artist: 'Linkin Park', album: 'Hybrid Theory', duration: 157 },

  // ═══════════════════════════════════════════
  // GREEN DAY - 6 songs
  // ═══════════════════════════════════════════
  { id: 'gd_1', title: 'Boulevard of Broken Dreams', artist: 'Green Day', album: 'American Idiot', duration: 262 },
  { id: 'gd_2', title: 'American Idiot', artist: 'Green Day', album: 'American Idiot', duration: 174 },
  { id: 'gd_3', title: 'Wake Me Up When September Ends', artist: 'Green Day', album: 'American Idiot', duration: 285 },
  { id: 'gd_4', title: '21 Guns', artist: 'Green Day', album: '21st Century Breakdown', duration: 321 },
  { id: 'gd_5', title: 'Holiday', artist: 'Green Day', album: 'American Idiot', duration: 233 },
  { id: 'gd_6', title: 'Good Riddance (Time of Your Life)', artist: 'Green Day', album: 'Nimrod', duration: 154 },

  // ═══════════════════════════════════════════
  // U2 - 6 songs
  // ═══════════════════════════════════════════
  { id: 'u21', title: 'With or Without You', artist: 'U2', album: 'The Joshua Tree', duration: 296 },
  { id: 'u22', title: 'One', artist: 'U2', album: 'Achtung Baby', duration: 276 },
  { id: 'u23', title: 'Beautiful Day', artist: 'U2', album: 'All That You Can\'t Leave Behind', duration: 246 },
  { id: 'u24', title: 'I Still Haven\'t Found What I\'m Looking For', artist: 'U2', album: 'The Joshua Tree', duration: 278 },
  { id: 'u25', title: 'Where the Streets Have No Name', artist: 'U2', album: 'The Joshua Tree', duration: 317 },
  { id: 'u26', title: 'Pride (In the Name of Love)', artist: 'U2', album: 'The Unforgettable Fire', duration: 228 },

  // ═══════════════════════════════════════════
  // ABBA - 6 songs
  // ═══════════════════════════════════════════
  { id: 'ab1', title: 'Dancing Queen', artist: 'ABBA', album: 'Arrival', duration: 231 },
  { id: 'ab2', title: 'Mamma Mia', artist: 'ABBA', album: 'ABBA', duration: 212 },
  { id: 'ab3', title: 'Waterloo', artist: 'ABBA', album: 'Waterloo', duration: 166 },
  { id: 'ab4', title: 'Take a Chance on Me', artist: 'ABBA', album: 'ABBA: The Album', duration: 243 },
  { id: 'ab5', title: 'The Winner Takes It All', artist: 'ABBA', album: 'Super Trouper', duration: 294 },
  { id: 'ab6', title: 'SOS', artist: 'ABBA', album: 'ABBA', duration: 203 },

  // ═══════════════════════════════════════════
  // LIZZO - 6 songs
  // ═══════════════════════════════════════════
  { id: 'lz1', title: 'About Damn Time', artist: 'Lizzo', album: 'Special', duration: 191 },
  { id: 'lz2', title: 'Truth Hurts', artist: 'Lizzo', album: 'Cuz I Love You', duration: 173 },
  { id: 'lz3', title: 'Good as Hell', artist: 'Lizzo', album: 'Cuz I Love You', duration: 159 },
  { id: 'lz4', title: 'Juice', artist: 'Lizzo', album: 'Cuz I Love You', duration: 195 },
  { id: 'lz5', title: 'Boys', artist: 'Lizzo', album: 'Cuz I Love You', duration: 172 },
  { id: 'lz6', title: 'Special', artist: 'Lizzo', album: 'Special', duration: 174 },

  // ═══════════════════════════════════════════
  // FOO FIGHTERS - 6 songs
  // ═══════════════════════════════════════════
  { id: 'ff1', title: 'Everlong', artist: 'Foo Fighters', album: 'The Colour and the Shape', duration: 250 },
  { id: 'ff2', title: 'Learn to Fly', artist: 'Foo Fighters', album: 'There Is Nothing Left to Lose', duration: 235 },
  { id: 'ff3', title: 'The Pretender', artist: 'Foo Fighters', album: 'Echoes Silence Patience & Grace', duration: 269 },
  { id: 'ff4', title: 'Best of You', artist: 'Foo Fighters', album: 'In Your Honor', duration: 255 },
  { id: 'ff5', title: 'My Hero', artist: 'Foo Fighters', album: 'The Colour and the Shape', duration: 260 },
  { id: 'ff6', title: 'Times Like These', artist: 'Foo Fighters', album: 'One by One', duration: 238 },

  // ═══════════════════════════════════════════
  // DAFT PUNK - 6 songs
  // ═══════════════════════════════════════════
  { id: 'dp1', title: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', duration: 248 },
  { id: 'dp2', title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', duration: 320 },
  { id: 'dp3', title: 'Around the World', artist: 'Daft Punk', album: 'Homework', duration: 428 },
  { id: 'dp4', title: 'Harder Better Faster Stronger', artist: 'Daft Punk', album: 'Discovery', duration: 225 },
  { id: 'dp5', title: 'Something About Us', artist: 'Daft Punk', album: 'Discovery', duration: 232 },
  { id: 'dp6', title: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', duration: 337 },
];

export const totalEnglishSongs = englishSongs.length;
export const englishArtistCount = [...new Set(englishSongs.map(s => s.artist))].length;
export const englishArtists = [...new Set(englishSongs.map(s => s.artist))].sort();

export function getEnglishSongsByArtist(artistName) {
  return englishSongs.filter(s => s.artist === artistName);
}

export function searchEnglishSongs(query) {
  const q = query.toLowerCase();
  return englishSongs.filter(s =>
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );
}

export default englishSongs;