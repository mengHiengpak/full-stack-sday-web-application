const khmerSongs = [
  // ═══════════════════════════════════════════
  // SINN SISAMOUTH (ស៊ិន ស៊ីសាមុត) - 50 songs
  // ═══════════════════════════════════════════
  { id: 'ss1', title: 'ផ្កាយព្រឹក', artist: 'Sinn Sisamouth', album: 'Classics Vol.1', duration: 210 },
  { id: 'ss2', title: 'សំរស់ជីវិត', artist: 'Sinn Sisamouth', album: 'Classics Vol.1', duration: 198 },
  { id: 'ss3', title: 'រាត្រីស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Classics Vol.1', duration: 223 },
  { id: 'ss4', title: 'ស្រីអង្គរ', artist: 'Sinn Sisamouth', album: 'Classics Vol.1', duration: 215 },
  { id: 'ss5', title: 'នារីក្រុងរាជ', artist: 'Sinn Sisamouth', album: 'Classics Vol.1', duration: 207 },
  { id: 'ss6', title: 'បទពិណពាទ្យ', artist: 'Sinn Sisamouth', album: 'Classics Vol.2', duration: 234 },
  { id: 'ss7', title: 'រសៀលរៀងអារម្មណ៍', artist: 'Sinn Sisamouth', album: 'Classics Vol.2', duration: 226 },
  { id: 'ss8', title: 'សែនស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Classics Vol.2', duration: 219 },
  { id: 'ss9', title: 'យប់ភ្លៀង', artist: 'Sinn Sisamouth', album: 'Classics Vol.2', duration: 241 },
  { id: 'ss10', title: 'រដូវស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Classics Vol.2', duration: 212 },
  { id: 'ss11', title: 'ផ្កាស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Love Songs', duration: 206 },
  { id: 'ss12', title: 'បទអកន្តិកា', artist: 'Sinn Sisamouth', album: 'Love Songs', duration: 218 },
  { id: 'ss13', title: 'នារីមាស', artist: 'Sinn Sisamouth', album: 'Golden Hits', duration: 224 },
  { id: 'ss14', title: 'ស្នេហ៍ថ្មី', artist: 'Sinn Sisamouth', album: 'New Love', duration: 197 },
  { id: 'ss15', title: 'រឿងជីវិត', artist: 'Sinn Sisamouth', album: 'Life Story', duration: 233 },
  { id: 'ss16', title: 'ចម្រៀងរាត្រី', artist: 'Sinn Sisamouth', album: 'Night Songs', duration: 216 },
  { id: 'ss17', title: 'ផ្កាឈូកមាស', artist: 'Sinn Sisamouth', album: 'Golden Lotus', duration: 208 },
  { id: 'ss18', title: 'ស្នេហ៍មិនភ្លេច', artist: 'Sinn Sisamouth', album: 'Unforgettable', duration: 235 },
  { id: 'ss19', title: 'រាត្រីរាំ', artist: 'Sinn Sisamouth', album: 'Dance Night', duration: 242 },
  { id: 'ss20', title: 'ក្មេងស្រីម្នាក់', artist: 'Sinn Sisamouth', album: 'Classics Vol.3', duration: 201 },
  { id: 'ss21', title: 'ស្រឡាញ់ស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Classics Vol.3', duration: 189 },
  { id: 'ss22', title: 'នឹកបងណាស់', artist: 'Sinn Sisamouth', album: 'Classics Vol.3', duration: 214 },
  { id: 'ss23', title: 'រឿងស្នេហ៍យើង', artist: 'Sinn Sisamouth', album: 'Our Story', duration: 228 },
  { id: 'ss24', title: 'ស្នេហ៍ពិត', artist: 'Sinn Sisamouth', album: 'True Love', duration: 221 },
  { id: 'ss25', title: 'បេះដូងត្រូវអូនយក', artist: 'Sinn Sisamouth', album: 'Heart Collection', duration: 237 },
  { id: 'ss26', title: 'អូនជាទីស្នេហ៍', artist: 'Sinn Sisamouth', album: 'You Are My Love', duration: 244 },
  { id: 'ss27', title: 'ស្នេហ៍គ្មានព្រំដែន', artist: 'Sinn Sisamouth', album: 'Endless Love', duration: 251 },
  { id: 'ss28', title: 'កុំក្បត់ស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Heart Songs', duration: 208 },
  { id: 'ss29', title: 'អូនជាទេវតា', artist: 'Sinn Sisamouth', album: 'Angel', duration: 217 },
  { id: 'ss30', title: 'នឹកអូនរាល់ថ្ងៃ', artist: 'Sinn Sisamouth', album: 'Missing You Daily', duration: 226 },
  { id: 'ss31', title: 'ចង់ឃើញមុខអូន', artist: 'Sinn Sisamouth', album: 'Want To See You', duration: 213 },
  { id: 'ss32', title: 'អូនជាពន្លឺ', artist: 'Sinn Sisamouth', album: 'Light Of My Life', duration: 225 },
  { id: 'ss33', title: 'ស្បថស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Love Promise', duration: 231 },
  { id: 'ss34', title: 'អរគុណដែលស្រលាញ់', artist: 'Sinn Sisamouth', album: 'Thank You For Love', duration: 219 },
  { id: 'ss35', title: 'រាត្រីគ្មានអូន', artist: 'Sinn Sisamouth', album: 'Night Without You', duration: 245 },
  { id: 'ss36', title: 'សុំស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Ask For Love', duration: 204 },
  { id: 'ss37', title: 'បង្អស់សង្សារ', artist: 'Sinn Sisamouth', album: 'Original Love', duration: 238 },
  { id: 'ss38', title: 'ស្រលាញ់អ្នកដូចម៉េច', artist: 'Sinn Sisamouth', album: 'How I Love You', duration: 227 },
  { id: 'ss39', title: 'មិនអាចបំភ្លេច', artist: 'Sinn Sisamouth', album: 'Cannot Forget', duration: 241 },
  { id: 'ss40', title: 'ស្នេហ៍និមិត្ត', artist: 'Sinn Sisamouth', album: 'Symbol Of Love', duration: 236 },
  { id: 'ss41', title: 'រង់ចាំបង', artist: 'Sinn Sisamouth', album: 'Waiting For You', duration: 222 },
  { id: 'ss42', title: 'រឿងរ៉ាវស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Love Stories', duration: 249 },
  { id: 'ss43', title: 'សុបិន្តស្នេហ៍', artist: 'Sinn Sisamouth', album: 'Dream Of Love', duration: 218 },
  { id: 'ss44', title: 'ជីវិតថ្មី', artist: 'Sinn Sisamouth', album: 'New Life', duration: 235 },
  { id: 'ss45', title: 'អូនដឹងហើយ', artist: 'Sinn Sisamouth', album: 'I Know Now', duration: 211 },
  { id: 'ss46', title: 'រឿងចុងក្រោយ', artist: 'Sinn Sisamouth', album: 'Final Chapter', duration: 253 },
  { id: 'ss47', title: 'ស្នេហ៍មិនចេះប្រែ', artist: 'Sinn Sisamouth', album: 'Unchanging Love', duration: 243 },
  { id: 'ss48', title: 'ចាំបងវិញ', artist: 'Sinn Sisamouth', album: 'Wait For Me', duration: 229 },
  { id: 'ss49', title: 'បងនិងអូន', artist: 'Sinn Sisamouth', album: 'You And Me', duration: 215 },
  { id: 'ss50', title: 'អូនក៏ស្រលាញ់បង', artist: 'Sinn Sisamouth', album: 'I Love You Too', duration: 209 },

  // ═══════════════════════════════════════════
  // ROS SEREY SOTHEA (រស់ សេរីសុទ្ធា) - 25 songs
  // ═══════════════════════════════════════════
  { id: 'rs1', title: 'រាត្រីស្នេហ៍', artist: 'Ros Serey Sothea', album: 'Golden Hits Vol.1', duration: 198 },
  { id: 'rs2', title: 'ផ្កាស្នេហ៍', artist: 'Ros Serey Sothea', album: 'Golden Hits Vol.1', duration: 205 },
  { id: 'rs3', title: 'ស្នេហ៍មិនភ្លេច', artist: 'Ros Serey Sothea', album: 'Memories Vol.1', duration: 216 },
  { id: 'rs4', title: 'ក្មេងស្រីម្នាក់', artist: 'Ros Serey Sothea', album: 'Classic Collection', duration: 223 },
  { id: 'rs5', title: 'រឿងជីវិត', artist: 'Ros Serey Sothea', album: 'Life Story', duration: 196 },
  { id: 'rs6', title: 'ចម្រៀងរាត្រី', artist: 'Ros Serey Sothea', album: 'Night Songs', duration: 232 },
  { id: 'rs7', title: 'នារីរាំ', artist: 'Ros Serey Sothea', album: 'Dance Collection', duration: 188 },
  { id: 'rs8', title: 'ផ្កាឈូកមាស', artist: 'Ros Serey Sothea', album: 'Golden Lotus', duration: 214 },
  { id: 'rs9', title: 'ស្នេហ៍ពិត', artist: 'Ros Serey Sothea', album: 'True Love', duration: 228 },
  { id: 'rs10', title: 'នឹកបងណាស់', artist: 'Ros Serey Sothea', album: 'Missing You', duration: 207 },
  { id: 'rs11', title: 'រដូវស្នេហ៍', artist: 'Ros Serey Sothea', album: 'Season Of Love', duration: 235 },
  { id: 'rs12', title: 'ផ្កាយព្រឹក', artist: 'Ros Serey Sothea', album: 'Morning Star', duration: 199 },
  { id: 'rs13', title: 'សំរស់ជីវិត', artist: 'Ros Serey Sothea', album: 'Life Essence', duration: 221 },
  { id: 'rs14', title: 'រាត្រីរាំ', artist: 'Ros Serey Sothea', album: 'Dance Night', duration: 243 },
  { id: 'rs15', title: 'បទពិណពាទ្យ', artist: 'Ros Serey Sothea', album: 'Traditional', duration: 218 },
  { id: 'rs16', title: 'នារីក្រុងរាជ', artist: 'Ros Serey Sothea', album: 'Royal Lady', duration: 212 },
  { id: 'rs17', title: 'សែនស្នេហ៍', artist: 'Ros Serey Sothea', album: 'Endless Love', duration: 226 },
  { id: 'rs18', title: 'យប់ភ្លៀង', artist: 'Ros Serey Sothea', album: 'Rainy Night', duration: 204 },
  { id: 'rs19', title: 'បទអកន្តិកា', artist: 'Ros Serey Sothea', album: 'Classics', duration: 237 },
  { id: 'rs20', title: 'នារីមាស', artist: 'Ros Serey Sothea', album: 'Golden Girl', duration: 215 },
  { id: 'rs21', title: 'ស្នេហ៍ថ្មី', artist: 'Ros Serey Sothea', album: 'New Love', duration: 201 },
  { id: 'rs22', title: 'ស្រឡាញ់ស្នេហ៍', artist: 'Ros Serey Sothea', album: 'Love Affair', duration: 229 },
  { id: 'rs23', title: 'រឿងស្នេហ៍យើង', artist: 'Ros Serey Sothea', album: 'Our Love Story', duration: 241 },
  { id: 'rs24', title: 'ស្នេហ៍គ្មានព្រំដែន', artist: 'Ros Serey Sothea', album: 'Boundless Love', duration: 234 },
  { id: 'rs25', title: 'កុំក្បត់ស្នេហ៍', artist: 'Ros Serey Sothea', album: 'Don\'t Betray Love', duration: 211 },

  // ═══════════════════════════════════════════
  // PEN RAN (ប៉ែន រ៉ន) - 15 songs
  // ═══════════════════════════════════════════
  { id: 'pr1', title: 'ស្នេហ៍ក្នុងចិត្ត', artist: 'Pen Ran', album: 'Classic Hits', duration: 218 },
  { id: 'pr2', title: 'រាត្រីស្នេហ៍បង', artist: 'Pen Ran', album: 'Love Collection', duration: 206 },
  { id: 'pr3', title: 'នឹកបង', artist: 'Pen Ran', album: 'Missing', duration: 224 },
  { id: 'pr4', title: 'ចម្រៀងបេះដូង', artist: 'Pen Ran', album: 'Heart Songs', duration: 213 },
  { id: 'pr5', title: 'រឿងស្នេហ៍', artist: 'Pen Ran', album: 'Love Story', duration: 237 },
  { id: 'pr6', title: 'ស្នេហ៍សាមគ្គី', artist: 'Pen Ran', album: 'Golden Hits', duration: 228 },
  { id: 'pr7', title: 'ផ្ការស្មី', artist: 'Pen Ran', album: 'Flower Collection', duration: 215 },
  { id: 'pr8', title: 'រសៀលរដូវ', artist: 'Pen Ran', album: 'Afternoon Songs', duration: 241 },
  { id: 'pr9', title: 'សុបិន្តរាត្រី', artist: 'Pen Ran', album: 'Night Dreams', duration: 209 },
  { id: 'pr10', title: 'របាំស្នេហ៍', artist: 'Pen Ran', album: 'Love Dance', duration: 222 },
  { id: 'pr11', title: 'នារីស្រស់', artist: 'Pen Ran', album: 'Beautiful Lady', duration: 217 },
  { id: 'pr12', title: 'ស្នេហ៍និទាឃរដូវ', artist: 'Pen Ran', album: 'Spring Love', duration: 233 },
  { id: 'pr13', title: 'រាត្រីពេជ្រពន្លឺ', artist: 'Pen Ran', album: 'Diamond Night', duration: 226 },
  { id: 'pr14', title: 'ស្នេហ៍រលាយ', artist: 'Pen Ran', album: 'Melting Love', duration: 219 },
  { id: 'pr15', title: 'បទលាងស្នេហ៍', artist: 'Pen Ran', album: 'Farewell Love', duration: 244 },

  // ═══════════════════════════════════════════
  // PREAP SOVATH (ព្រាប សុវត្ថិ) - 25 songs
  // ═══════════════════════════════════════════
  { id: 'ps1', title: 'ស្នេហ៍និមិត្ត', artist: 'Preap Sovath', album: 'Best Of Preap Sovath', duration: 245 },
  { id: 'ps2', title: 'បង្អស់សង្សារ', artist: 'Preap Sovath', album: 'Best Of Preap Sovath', duration: 232 },
  { id: 'ps3', title: 'ស្រលាញ់អ្នកដូចម៉េច', artist: 'Preap Sovath', album: 'Love Songs', duration: 218 },
  { id: 'ps4', title: 'មិនអាចបំភ្លេច', artist: 'Preap Sovath', album: 'Love Songs', duration: 256 },
  { id: 'ps5', title: 'អូនជាទីស្នេហ៍', artist: 'Preap Sovath', album: 'Romantic', duration: 241 },
  { id: 'ps6', title: 'ស្នេហ៍ពិត', artist: 'Preap Sovath', album: 'Romantic', duration: 229 },
  { id: 'ps7', title: 'បេះដូងត្រូវអូនយក', artist: 'Preap Sovath', album: 'Hits Collection', duration: 237 },
  { id: 'ps8', title: 'រាត្រីរាំ', artist: 'Preap Sovath', album: 'Party Mix', duration: 263 },
  { id: 'ps9', title: 'សង្សារថ្មី', artist: 'Preap Sovath', album: 'New Hits', duration: 224 },
  { id: 'ps10', title: 'អូនជីវិត', artist: 'Preap Sovath', album: 'Love Collection', duration: 251 },
  { id: 'ps11', title: 'កុំក្បត់ស្នេហ៍', artist: 'Preap Sovath', album: 'Heart Songs', duration: 238 },
  { id: 'ps12', title: 'សុំស្នេហ៍', artist: 'Preap Sovath', album: 'Heart Songs', duration: 245 },
  { id: 'ps13', title: 'អូនជាទេវតា', artist: 'Preap Sovath', album: 'Angel', duration: 222 },
  { id: 'ps14', title: 'ស្នេហ៍គ្មានព្រំដែន', artist: 'Preap Sovath', album: 'Endless Love', duration: 267 },
  { id: 'ps15', title: 'នឹកអូនរាល់ថ្ងៃ', artist: 'Preap Sovath', album: 'Missing You', duration: 233 },
  { id: 'ps16', title: 'ចង់ឃើញមុខអូន', artist: 'Preap Sovath', album: 'Missing You', duration: 219 },
  { id: 'ps17', title: 'រឿងស្នេហ៍យើង', artist: 'Preap Sovath', album: 'Our Story', duration: 256 },
  { id: 'ps18', title: 'អូនជាពន្លឺ', artist: 'Preap Sovath', album: 'Light', duration: 228 },
  { id: 'ps19', title: 'ស្បថស្នេហ៍', artist: 'Preap Sovath', album: 'Promise', duration: 242 },
  { id: 'ps20', title: 'អរគុណដែលស្រលាញ់', artist: 'Preap Sovath', album: 'Thanks For Love', duration: 235 },
  { id: 'ps21', title: 'នឹកបង', artist: 'Preap Sovath', album: 'Missing You', duration: 227 },
  { id: 'ps22', title: 'ចាំបងវិញ', artist: 'Preap Sovath', album: 'Wait For Me', duration: 241 },
  { id: 'ps23', title: 'បងនិងអូន', artist: 'Preap Sovath', album: 'You And Me', duration: 224 },
  { id: 'ps24', title: 'អូនក៏ស្រលាញ់បង', artist: 'Preap Sovath', album: 'I Love You Too', duration: 236 },
  { id: 'ps25', title: 'រឿងរ៉ាវស្នេហ៍', artist: 'Preap Sovath', album: 'Love Stories', duration: 258 },

  // ═══════════════════════════════════════════
  // AOK SOKUNKANHA (ឱក សុគន្ធកញ្ញា) - 20 songs
  // ═══════════════════════════════════════════
  { id: 'as1', title: 'បេះដូងខ្ញុំ', artist: 'Aok Sokunkanha', album: 'My Heart', duration: 242 },
  { id: 'as2', title: 'ស្នេហ៍របស់អូន', artist: 'Aok Sokunkanha', album: 'Your Love', duration: 228 },
  { id: 'as3', title: 'នឹកបងណាស់', artist: 'Aok Sokunkanha', album: 'Missing You', duration: 235 },
  { id: 'as4', title: 'រង់ចាំបង', artist: 'Aok Sokunkanha', album: 'Waiting', duration: 251 },
  { id: 'as5', title: 'ស្រលាញ់បងខ្លាំងណាស់', artist: 'Aok Sokunkanha', album: 'Love Strong', duration: 244 },
  { id: 'as6', title: 'បងនិងអូន', artist: 'Aok Sokunkanha', album: 'You And Me', duration: 217 },
  { id: 'as7', title: 'រឿងរ៉ាវស្នេហ៍', artist: 'Aok Sokunkanha', album: 'Love Story', duration: 263 },
  { id: 'as8', title: 'អូនក៏ស្រលាញ់បង', artist: 'Aok Sokunkanha', album: 'I Love You Too', duration: 239 },
  { id: 'as9', title: 'បងនៅនឹកអូនទេ', artist: 'Aok Sokunkanha', album: 'Do You Miss Me', duration: 226 },
  { id: 'as10', title: 'ស្នេហ៍មិនចេះប្រែ', artist: 'Aok Sokunkanha', album: 'Unchanging Love', duration: 254 },
  { id: 'as11', title: 'ចាំបងវិញ', artist: 'Aok Sokunkanha', album: 'Wait For Me', duration: 231 },
  { id: 'as12', title: 'សុបិន្តស្នេហ៍', artist: 'Aok Sokunkanha', album: 'Dream Love', duration: 248 },
  { id: 'as13', title: 'ជីវិតថ្មី', artist: 'Aok Sokunkanha', album: 'New Life', duration: 221 },
  { id: 'as14', title: 'អូនដឹងហើយ', artist: 'Aok Sokunkanha', album: 'I Know', duration: 236 },
  { id: 'as15', title: 'រឿងចុងក្រោយ', artist: 'Aok Sokunkanha', album: 'Final Story', duration: 259 },
  { id: 'as16', title: 'ស្នេហ៍ពិត', artist: 'Aok Sokunkanha', album: 'True Love', duration: 225 },
  { id: 'as17', title: 'អូនជាទីស្នេហ៍', artist: 'Aok Sokunkanha', album: 'My Love', duration: 243 },
  { id: 'as18', title: 'កុំក្បត់ស្នេហ៍', artist: 'Aok Sokunkanha', album: 'Heart Songs', duration: 238 },
  { id: 'as19', title: 'ស្នេហ៍គ្មានព្រំដែន', artist: 'Aok Sokunkanha', album: 'Endless Love', duration: 261 },
  { id: 'as20', title: 'នឹកអូនរាល់ថ្ងៃ', artist: 'Aok Sokunkanha', album: 'Missing You Daily', duration: 232 },

  // ═══════════════════════════════════════════
  // MEAS SAMON (មាស សាម៉ន) - 12 songs
  // ═══════════════════════════════════════════
  { id: 'ms1', title: 'ចម្រៀងស្នេហ៍', artist: 'Meas Samon', album: 'Love Songs', duration: 238 },
  { id: 'ms2', title: 'នឹកបងណាស់', artist: 'Meas Samon', album: 'Missing', duration: 225 },
  { id: 'ms3', title: 'ស្រលាញ់បង', artist: 'Meas Samon', album: 'Love', duration: 247 },
  { id: 'ms4', title: 'អូនរង់ចាំ', artist: 'Meas Samon', album: 'Waiting', duration: 213 },
  { id: 'ms5', title: 'បងនិងខ្ញុំ', artist: 'Meas Samon', album: 'Together', duration: 241 },
  { id: 'ms6', title: 'ជីវិតគ្មានបង', artist: 'Meas Samon', album: 'Without You', duration: 256 },
  { id: 'ms7', title: 'ស្នេហ៍ពិត', artist: 'Meas Samon', album: 'True Love', duration: 229 },
  { id: 'ms8', title: 'រឿងជីវិត', artist: 'Meas Samon', album: 'Life Story', duration: 244 },
  { id: 'ms9', title: 'ស្នេហ៍មិនភ្លេច', artist: 'Meas Samon', album: 'Unforgettable', duration: 218 },
  { id: 'ms10', title: 'នារីរាំ', artist: 'Meas Samon', album: 'Dance', duration: 206 },
  { id: 'ms11', title: 'រាត្រីស្នេហ៍', artist: 'Meas Samon', album: 'Night Love', duration: 233 },
  { id: 'ms12', title: 'ផ្កាស្នេហ៍', artist: 'Meas Samon', album: 'Love Flower', duration: 221 },

  // ═══════════════════════════════════════════
  // NOP BAYYARETH (នប បុយ្យរ័ត្ន) - 10 songs
  // ═══════════════════════════════════════════
  { id: 'nb1', title: 'រឿងស្នេហ៍យើង', artist: 'Nop Bayyareth', album: 'Our Love', duration: 254 },
  { id: 'nb2', title: 'ចង់ធ្វើអ្វីប្រាប់', artist: 'Nop Bayyareth', album: 'Tell Me', duration: 237 },
  { id: 'nb3', title: 'រាត្រីគ្មានអូន', artist: 'Nop Bayyareth', album: 'Night Alone', duration: 261 },
  { id: 'nb4', title: 'ស្នេហ៍របស់ខ្ញុំ', artist: 'Nop Bayyareth', album: 'My Love', duration: 242 },
  { id: 'nb5', title: 'នឹកអូន', artist: 'Nop Bayyareth', album: 'Missing You', duration: 228 },
  { id: 'nb6', title: 'ចាំបងសិន', artist: 'Nop Bayyareth', album: 'Wait For Me', duration: 235 },
  { id: 'nb7', title: 'ស្នេហ៍គ្មានថ្ងៃប្រែ', artist: 'Nop Bayyareth', album: 'Eternal Love', duration: 249 },
  { id: 'nb8', title: 'បងនិងអូន', artist: 'Nop Bayyareth', album: 'You And I', duration: 223 },
  { id: 'nb9', title: 'រាត្រីស្នេហ៍', artist: 'Nop Bayyareth', album: 'Romantic Night', duration: 256 },
  { id: 'nb10', title: 'ស្នេហ៍ពិតរបស់អូន', artist: 'Nop Bayyareth', album: 'True Love', duration: 241 },

  // ═══════════════════════════════════════════
  // KONG SEY (គង់ ស៊ី) - 8 songs
  // ═══════════════════════════════════════════
  { id: 'kp1', title: 'ស្រីស្អាត', artist: 'Kong Sey', album: 'Classic', duration: 225 },
  { id: 'kp2', title: 'រឿងកំសាន្តអារម្មណ៍', artist: 'Kong Sey', album: 'Entertainment', duration: 233 },
  { id: 'kp3', title: 'នារីរាំ', artist: 'Kong Sey', album: 'Dance', duration: 218 },
  { id: 'kp4', title: 'រាត្រីស្នេហ៍', artist: 'Kong Sey', album: 'Love Night', duration: 241 },
  { id: 'kp5', title: 'ស្នេហ៍ពិត', artist: 'Kong Sey', album: 'True Love', duration: 227 },
  { id: 'kp6', title: 'នឹកបងណាស់', artist: 'Kong Sey', album: 'Missing', duration: 214 },
  { id: 'kp7', title: 'ផ្កាស្នេហ៍', artist: 'Kong Sey', album: 'Love Flower', duration: 221 },
  { id: 'kp8', title: 'ចម្រៀងរាត្រី', artist: 'Kong Sey', album: 'Night Song', duration: 236 },

  // ═══════════════════════════════════════════
  // SEREY ATH (សេរី អាត់) - 8 songs
  // ═══════════════════════════════════════════
  { id: 'sa1', title: 'នារីរូបស្អាត', artist: 'Serey Ath', album: 'Beautiful Girl', duration: 215 },
  { id: 'sa2', title: 'ស្នេហ៍ពីចម្ងាយ', artist: 'Serey Ath', album: 'Distance Love', duration: 228 },
  { id: 'sa3', title: 'នឹកអូនណាស់', artist: 'Serey Ath', album: 'Miss You', duration: 234 },
  { id: 'sa4', title: 'រឿងស្នេហ៍', artist: 'Serey Ath', album: 'Love Story', duration: 247 },
  { id: 'sa5', title: 'រាត្រីគ្មានបង', artist: 'Serey Ath', album: 'Night Without You', duration: 221 },
  { id: 'sa6', title: 'ស្នេហ៍ពិតមិនងាយ', artist: 'Serey Ath', album: 'True Love', duration: 239 },
  { id: 'sa7', title: 'ចាំបងវិញ', artist: 'Serey Ath', album: 'Wait For Me', duration: 225 },
  { id: 'sa8', title: 'អូនជារបស់បង', artist: 'Serey Ath', album: 'I Am Yours', duration: 218 },

  // ═══════════════════════════════════════════
  // CHEA SATHYA (ជា សត្យា) - 8 songs
  // ═══════════════════════════════════════════
  { id: 'cs1', title: 'ផ្ការដូវ', artist: 'Chea Sathya', album: 'Season Flower', duration: 218 },
  { id: 'cs2', title: 'រាត្រីរាំ', artist: 'Chea Sathya', album: 'Dance Night', duration: 206 },
  { id: 'cs3', title: 'នឹកបង', artist: 'Chea Sathya', album: 'Missing', duration: 224 },
  { id: 'cs4', title: 'ស្នេហ៍ខ្ញុំ', artist: 'Chea Sathya', album: 'My Love', duration: 231 },
  { id: 'cs5', title: 'រឿងស្នេហ៍', artist: 'Chea Sathya', album: 'Love Story', duration: 242 },
  { id: 'cs6', title: 'ស្រលាញ់បង', artist: 'Chea Sathya', album: 'Love You', duration: 217 },
  { id: 'cs7', title: 'ចាំបងសិន', artist: 'Chea Sathya', album: 'Wait', duration: 225 },
  { id: 'cs8', title: 'រាត្រីស្នេហ៍', artist: 'Chea Sathya', album: 'Love Night', duration: 238 },

  // ═══════════════════════════════════════════
  // SOKUN NISA (សុគន្ធ នីសា) - 8 songs
  // ═══════════════════════════════════════════
  { id: 'sn1', title: 'អូនជាមនុស្សម្នាក់', artist: 'Sokun Nisa', album: 'Someone', duration: 241 },
  { id: 'sn2', title: 'ក្តីសង្ឈឹម', artist: 'Sokun Nisa', album: 'Hope', duration: 234 },
  { id: 'sn3', title: 'ស្នេហ៍ពិត', artist: 'Sokun Nisa', album: 'True Love', duration: 227 },
  { id: 'sn4', title: 'នឹកបងណាស់', artist: 'Sokun Nisa', album: 'Missing You', duration: 219 },
  { id: 'sn5', title: 'រឿងជីវិត', artist: 'Sokun Nisa', album: 'Life Story', duration: 245 },
  { id: 'sn6', title: 'រាត្រីស្នេហ៍', artist: 'Sokun Nisa', album: 'Love Night', duration: 238 },
  { id: 'sn7', title: 'ចាំបង', artist: 'Sokun Nisa', album: 'Waiting', duration: 226 },
  { id: 'sn8', title: 'ស្រលាញ់បង', artist: 'Sokun Nisa', album: 'Love', duration: 233 },

  // ═══════════════════════════════════════════
  // MODERN KHMER ARTISTS - 40 songs
  // ═══════════════════════════════════════════
  { id: 'vn1', title: 'ស្រលាញ់អូនមួយ', artist: 'Vannda', album: 'Modern Hits', duration: 215 },
  { id: 'vn2', title: 'វិលមកវិញ', artist: 'Vannda', album: 'Come Back', duration: 198 },
  { id: 'vn3', title: 'រាំលេងៗ', artist: 'Vannda', album: 'Dance', duration: 187 },
  { id: 'vn4', title: 'ភ្លេចមិនបាន', artist: 'Vannda', album: 'Unforgettable', duration: 221 },
  { id: 'vn5', title: 'អូននិងបង', artist: 'Vannda', album: 'Duet', duration: 204 },
  { id: 'vn6', title: 'ស្នេហ៍ខ្ញុំ', artist: 'Vannda', album: 'My Love', duration: 235 },
  { id: 'vn7', title: 'រឿងថ្មី', artist: 'Vannda', album: 'New Chapter', duration: 212 },
  { id: 'vn8', title: 'រាត្រីរាំ', artist: 'Vannda', album: 'Party', duration: 195 },
  { id: 'gd1', title: 'មិនដឹងទេ', artist: 'G-Devith', album: 'Hip Hop Khmer', duration: 192 },
  { id: 'gd2', title: 'រាំតាមចង្វាក់', artist: 'G-Devith', album: 'Dance Beat', duration: 178 },
  { id: 'gd3', title: 'ខ្មែររ៉េប', artist: 'G-Devith', album: 'Khmer Rap', duration: 215 },
  { id: 'gd4', title: 'សុបិន្តធំ', artist: 'G-Devith', album: 'Big Dreams', duration: 201 },
  { id: 'gd5', title: 'មោទនភាពជាខ្មែរ', artist: 'G-Devith', album: 'Khmer Pride', duration: 234 },
  { id: 'gd6', title: 'ក្មេងសម័យ', artist: 'G-Devith', album: 'Modern Youth', duration: 188 },
  { id: 'gd7', title: 'រាំរហូត', artist: 'G-Devith', album: 'Dance Forever', duration: 195 },
  { id: 'tn1', title: 'ស្នេហ៍ដំបូង', artist: 'Tena', album: 'First Love', duration: 226 },
  { id: 'tn2', title: 'អូនជារបស់បង', artist: 'Tena', album: 'Yours', duration: 218 },
  { id: 'tn3', title: 'ចង់នៅក្បែរ', artist: 'Tena', album: 'Stay Close', duration: 242 },
  { id: 'tn4', title: 'បេះដូងទន់ខ្សោយ', artist: 'Tena', album: 'Weak Heart', duration: 233 },
  { id: 'tn5', title: 'និយាយចេញពីចិត្ត', artist: 'Tena', album: 'From The Heart', duration: 221 },
  { id: 'tn6', title: 'ស្រលាញ់គ្មានថ្ងៃប្រែ', artist: 'Tena', album: 'Unchanging Love', duration: 238 },
  { id: 'tc1', title: 'ឆ្ងាយណាស់បង', artist: 'Ton Chanseyma', album: 'Far Away', duration: 236 },
  { id: 'tc2', title: 'ស្នេហ៍ពិតមិនងាយ', artist: 'Ton Chanseyma', album: 'True Love', duration: 224 },
  { id: 'tc3', title: 'រង់ចាំបង', artist: 'Ton Chanseyma', album: 'Patience', duration: 248 },
  { id: 'tc4', title: 'បងនឹកអូនទេ', artist: 'Ton Chanseyma', album: 'Missing', duration: 215 },
  { id: 'tc5', title: 'ស្នេហ៍ចុងក្រោយ', artist: 'Ton Chanseyma', album: 'Last Love', duration: 242 },
  { id: 'kn1', title: 'ជីវិតខ្ញុំ', artist: 'Khem', album: 'My Life', duration: 231 },
  { id: 'kn2', title: 'រៀបការណ៍', artist: 'Khem', album: 'Wedding', duration: 245 },
  { id: 'kn3', title: 'ស្នេហ៍គ្រួសារ', artist: 'Khem', album: 'Family Love', duration: 219 },
  { id: 'kn4', title: 'សុភមង្គល', artist: 'Khem', album: 'Happiness', duration: 238 },
  { id: 'mt1', title: 'ក្មេងស្រីម្នាក់', artist: 'Mech Sokunthea', album: 'Solo', duration: 218 },
  { id: 'mt2', title: 'ទឹកភ្នែកស្នេហ៍', artist: 'Mech Sokunthea', album: 'Tears', duration: 234 },
  { id: 'mt3', title: 'អូនមិនយំទេ', artist: 'Mech Sokunthea', album: 'Strong', duration: 208 },
  { id: 'pk1', title: 'ស្នេហ៍រដូវវស្សា', artist: 'Polinika', album: 'Rainy Love', duration: 242 },
  { id: 'pk2', title: 'នឹករឿងចាស់', artist: 'Polinika', album: 'Memories', duration: 227 },
  { id: 'pk3', title: 'រាត្រីរដូវ', artist: 'Polinika', album: 'Season Night', duration: 235 },
  { id: 'sk1', title: 'រាំរហូត', artist: 'Sok Seyla', album: 'Dance All Night', duration: 192 },
  { id: 'sk2', title: 'Party Khmer', artist: 'Sok Seyla', album: 'Party', duration: 178 },
  { id: 'sk3', title: 'រាត្រីសុខសាន្ត', artist: 'Sok Seyla', album: 'Good Night', duration: 215 },
  { id: 'sk4', title: 'ស្នេហ៍សម័យ', artist: 'Sok Seyla', album: 'Modern Love', duration: 223 },
];

export const totalKhmerSongs = khmerSongs.length;
export const artistCount = [...new Set(khmerSongs.map(s => s.artist))].length;
export const artists = [...new Set(khmerSongs.map(s => s.artist))].sort();

export function getSongsByArtist(artistName) {
  return khmerSongs.filter(s => s.artist === artistName);
}

export function searchKhmerSongs(query) {
  const q = query.toLowerCase();
  return khmerSongs.filter(s =>
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );
}

export default khmerSongs;