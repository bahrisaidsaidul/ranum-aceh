export function getSeedData() {
  return {
    users: [
      {
        id: 'user-traveler-1',
        name: 'Aisyah Rahma',
        email: 'wisatawan@ranum.id',
        password: 'password123',
        role: 'traveler',
        region: 'Banda Aceh',
        joinedAt: '2026-10-15'
      },
      {
        id: 'user-partner-1',
        name: 'Koperasi Kopi & Kuliner Gayo',
        email: 'mitra@ranum.id',
        password: 'password123',
        role: 'partner',
        businessName: 'Gayo & Serambi UMKM Group',
        region: 'Aceh Tengah',
        joinedAt: '2026-09-20'
      },
      {
        id: 'user-admin-1',
        name: 'Teuku Farhan (Admin)',
        email: 'admin@ranum.id',
        password: 'password123',
        role: 'admin',
        region: 'Banda Aceh',
        joinedAt: '2026-08-01'
      }
    ],

    destinations: [
      {
        id: 'dest-001',
        name: 'Masjid Raya Baiturrahman',
        category: 'religious',
        region: 'Banda Aceh',
        description: 'Ikon arsitektur Islam kebanggaan masyarakat Aceh dengan kubah hitam megah, payung elektrik pelataran, dan kolam refleksi yang menenangkan.',
        descriptionEn: 'The iconic landmark of Aceh featuring striking black domes, electric courtyard umbrellas, and serene reflecting pools.',
        imageUrl: './images/masjid-baiturrahman.jpg',
        gallery: [
          './images/masjid-baiturrahman.jpg',
          './images/rumoh-aceh.jpg'
        ],
        address: 'Jl. Moh. Jam No.1, Kp. Baru, Kec. Baiturrahman, Kota Banda Aceh',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=5.5536,95.3173',
        estimatedCost: 10000,
        facilities: ['Parkir Luas', 'Area Istirahat', 'Toilet Bersih', 'Pemandu Informasi', 'Akses Kursi Roda'],
        prayerFacilities: ['Ruang Salat Utama Ber-AC', 'Tempat Wudhu Luas & Terpisah', 'Peminjaman Busana Sopan / Mukena', 'Kajian Rutin'],
        accessInfo: 'Berada di pusat Kota Banda Aceh, ±25 menit berkendara dari Bandara Sultan Iskandar Muda.',
        lat: 5.5536, lng: 95.3173,
        featured: true
      },
      {
        id: 'dest-002',
        name: 'Museum Tsunami Aceh',
        category: 'historical',
        region: 'Banda Aceh',
        description: 'Bangunan monumental karya Ridwan Kamil sebagai ruang edukasi, refleksi sejarah, dan pusat mitigasi bencana bagi generasi masa depan.',
        descriptionEn: 'A deeply moving architectural memorial and educational museum honoring the 2004 Indian Ocean tsunami and disaster resilience.',
        imageUrl: './images/museum-tsunami.jpg',
        gallery: [
          './images/museum-tsunami.jpg',
          './images/masjid-baiturrahman.jpg'
        ],
        address: 'Jl. Sultan Iskandar Muda, Sukaramai, Kec. Baiturrahman, Banda Aceh',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=5.5477,95.3149',
        estimatedCost: 15000,
        facilities: ['Ruang Pamer Interaktif', 'Teater Mini', 'Perpustakaan', 'Area Parkir', 'Toko Suvenir'],
        prayerFacilities: ['Mushola Dalam Gedung', 'Tempat Wudhu Bersih', 'Dekat Masjid Raya Baiturrahman (±500m)'],
        accessInfo: '±5 menit dari Masjid Raya Baiturrahman, mudah dijangkau kendaraan roda dua maupun empat.',
        lat: 5.5477, lng: 95.3149,
        featured: true
      },
      {
        id: 'dest-003',
        name: 'Pantai Lampuuk',
        category: 'marine',
        region: 'Aceh Besar',
        description: 'Garis pantai pasir putih membentang dengan latar tebing karst hijau dan ombak Samudra Hindia yang memukau saat senja.',
        descriptionEn: 'A sweeping white-sand coastline framed by green karst cliffs and stunning Indian Ocean sunsets.',
        imageUrl: './images/pantai-lampuuk.jpg',
        gallery: [
          './images/pantai-lampuuk.jpg',
          './images/pantai-iboih-sabang.jpg'
        ],
        address: 'Meunasah Masjid, Kec. Lhoknga, Kabupaten Aceh Besar',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=5.4876,95.2266',
        estimatedCost: 20000,
        facilities: ['Gazebo Pantai', 'Warung Ikan Bakar', 'Kamar Bilas', 'Area Parkir', 'Konservasi Penyu'],
        prayerFacilities: ['Mushola Area Pantai', 'Dekat Masjid Rahmatullah Lampuuk (±1 km)'],
        accessInfo: '±30 menit berkendara ke arah barat daya dari pusat Kota Banda Aceh melalui jalan pesisir.',
        lat: 5.4876, lng: 95.2266,
        featured: true
      },
      {
        id: 'dest-004',
        name: 'Pantai Lhoknga',
        category: 'marine',
        region: 'Aceh Besar',
        description: 'Pantai berpasir lembut yang dikenal dengan ombak ideal bagi peselancar, hamparan cemara laut, dan suasana santai di tepi laut.',
        descriptionEn: 'Soft sandy shores famous for surfable waves, coastal pine trees, and a calm oceanfront atmosphere.',
        imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
        ],
        address: 'Kec. Lhoknga, Kabupaten Aceh Besar',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=5.4628,95.2422',
        estimatedCost: 15000,
        facilities: ['Penyewaan Papan Selancar', 'Pondok Teduh', 'Kedai Kelapa Muda', 'Toilet & Bilas'],
        prayerFacilities: ['Mushola Sederhana di Sekitar Warung', 'Masjid Kecamatan Lhoknga (±1.5 km)'],
        accessInfo: '±25 menit dari Banda Aceh via Jl. Banda Aceh–Meulaboh.',
        lat: 5.4628, lng: 95.2422,
        featured: false
      },
      {
        id: 'dest-005',
        name: 'Pulau Weh',
        category: 'nature',
        region: 'Sabang',
        description: 'Pulau vulkanik di ujung barat Indonesia dengan hutan tropis rimbun, teluk biru jernih, dan Tugu Nol Kilometer Nusantara.',
        descriptionEn: 'A volcanic island at Indonesia’s westernmost point, home to lush rainforest, crystal bays, and the Zero Kilometer Monument.',
        imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1000&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1000&q=80',
          './images/pantai-iboih-sabang.jpg'
        ],
        address: 'Kota Sabang, Pulau Weh, Aceh',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=5.8692,95.3204',
        estimatedCost: 120000,
        facilities: ['Pelabuhan Balohan', 'Rental Motor & Mobil', 'Pusat Informasi Wisata', 'Restoran Seafood'],
        prayerFacilities: ['Masjid Agung Babussalam Sabang', 'Mushola di Pelabuhan & Area Wisata'],
        accessInfo: 'Ditempuh ±45 menit menggunakan kapal cepat dari Pelabuhan Ulee Lheue, Banda Aceh.',
        lat: 5.8692, lng: 95.3204,
        featured: true
      },
      {
        id: 'dest-006',
        name: 'Pantai Iboih',
        category: 'marine',
        region: 'Sabang',
        description: 'Teluk berair sebening kristal di Pulau Weh, gerbang menuju taman laut Pulau Rubiah untuk snorkeling dan menyelam.',
        descriptionEn: 'Crystal-clear turquoise bay on Pulau Weh, the gateway to Rubiah Island’s vibrant coral gardens for snorkeling and diving.',
        imageUrl: './images/pantai-iboih-sabang.jpg',
        gallery: [
          './images/pantai-iboih-sabang.jpg',
          './images/pantai-lampuuk.jpg'
        ],
        address: 'Gampong Iboih, Kec. Sukakarya, Kota Sabang',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=5.8756,95.2571',
        estimatedCost: 75000,
        facilities: ['Rental Alat Snorkeling', 'Perahu Kaca ke Pulau Rubiah', 'Kafe Tepi Laut', 'Kamar Bilas'],
        prayerFacilities: ['Mushola Gampong Iboih', 'Tempat Wudhu Bersih dekat Dermaga'],
        accessInfo: '±40 menit perjalanan darat dari Pelabuhan Balohan Sabang.',
        lat: 5.8756, lng: 95.2571,
        featured: true
      },
      {
        id: 'dest-007',
        name: 'Danau Laut Tawar',
        category: 'nature',
        region: 'Aceh Tengah',
        description: 'Danau tektonik luas di dataran tinggi Gayo yang dikelilingi perbukitan pinus sejuk dan kabut pagi yang syahdu.',
        descriptionEn: 'An expansive highland lake in the Gayo mountains surrounded by cool pine hills and peaceful morning mist.',
        imageUrl: './images/danau-laut-tawar.jpg',
        gallery: [
          './images/danau-laut-tawar.jpg',
          './images/pantan-terong.jpg'
        ],
        address: 'Kec. Lut Tawar, Takengon, Kabupaten Aceh Tengah',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.6144,96.9161',
        estimatedCost: 25000,
        facilities: ['Dermaga Perahu Wisata', 'Kedai Kopi Gayo Tepi Danau', 'Spot Foto', 'Area Parkir'],
        prayerFacilities: ['Mushola Tepi Danau', 'Masjid Ruhama Takengon (±3 km)'],
        accessInfo: '±10 menit dari pusat Kota Takengon; sekitar 6–7 jam perjalanan darat dari Banda Aceh.',
        lat: 4.6144, lng: 96.9161,
        featured: true
      },
      {
        id: 'dest-008',
        name: 'Pantan Terong',
        category: 'nature',
        region: 'Aceh Tengah',
        description: 'Puncak bukit setinggi 1.350 mdpl dengan panorama 360 derajat Kota Takengon, Danau Laut Tawar, dan hamparan kebun kopi.',
        descriptionEn: 'A 1,350m highland viewpoint offering sweeping panoramas of Takengon, Lake Laut Tawar, and surrounding coffee slopes.',
        imageUrl: './images/pantan-terong.jpg',
        gallery: [
          './images/pantan-terong.jpg',
          './images/danau-laut-tawar.jpg'
        ],
        address: 'Kec. Bebesen, Kabupaten Aceh Tengah',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.6022,96.8178',
        estimatedCost: 20000,
        facilities: ['Gardu Pandang', 'Kedai Kopi Arabika', 'Area Parkir', 'Toilet'],
        prayerFacilities: ['Mushola Kayu di Area Puncak', 'Air Wudhu Alami Pegunungan'],
        accessInfo: '±20 menit menanjak dari pusat Kota Takengon dengan jalan beraspal.',
        lat: 4.6022, lng: 96.8178,
        featured: false
      },
      {
        id: 'dest-009',
        name: 'Air Terjun Burni Kelieten',
        category: 'nature',
        region: 'Aceh Tengah',
        description: 'Air terjun alami tersembunyi di tengah hutan pegunungan Gayo dengan udara sejuk dan aliran air jernih menenangkan.',
        descriptionEn: 'A tranquil mountain waterfall tucked within the lush Gayo highlands, offering crisp air and clear spring waters.',
        imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80'
        ],
        address: 'Kec. Ketol, Kabupaten Aceh Tengah',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.6820,96.7620',
        estimatedCost: 15000,
        facilities: ['Jalur Trekking Alami', 'Area Parkir Desa', 'Pemandu Lokal'],
        prayerFacilities: ['Mushola Desa Terdekat sebelum Jalur Trekking'],
        accessInfo: '±45 menit dari Takengon dilanjutkan berjalan kaki ringan ±15 menit.',
        lat: 4.6820, lng: 96.7620,
        featured: false
      },
      {
        id: 'dest-010',
        name: 'Bur Telege',
        category: 'nature',
        region: 'Bener Meriah',
        description: 'Bukit hijau sejuk dengan pemandangan pegunungan Bener Meriah, perkebunan kopi, dan udara segar khas dataran tinggi.',
        descriptionEn: 'A breezy green hilltop overlooking Bener Meriah’s mountain ridges, coffee estates, and cloud-kissed valleys.',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
        ],
        address: 'Desa Bale Redelong, Kabupaten Bener Meriah',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.7495,96.8422',
        estimatedCost: 15000,
        facilities: ['Spot Panorama', 'Saung Istirahat', 'Kedai Kopi Lokal', 'Area Parkir'],
        prayerFacilities: ['Mushola di Area Wisata', 'Tempat Wudhu'],
        accessInfo: '±25 menit dari Simpang Tiga Redelong, dapat diakses kendaraan pribadi.',
        lat: 4.7495, lng: 96.8422,
        featured: false
      },
      {
        id: 'dest-011',
        name: 'Air Terjun Tansaran Bidin',
        category: 'nature',
        region: 'Bener Meriah',
        description: 'Air terjun bertingkat yang dikelilingi tebing hijau rimbun dan perkebunan kopi warga di Kecamatan Bandar.',
        descriptionEn: 'A scenic cascade surrounded by emerald forest cliffs and smallholder Gayo coffee farms in Bandar.',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80'
        ],
        address: 'Kampung Tansaran Bidin, Kec. Bandar, Kabupaten Bener Meriah',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.7386,96.9806',
        estimatedCost: 15000,
        facilities: ['Jembatan Kayu', 'Area Parkir', 'Toilet Umum', 'Warung Warga'],
        prayerFacilities: ['Mushola Kampung Tansaran Bidin (±400m)'],
        accessInfo: '±30 menit dari Bandara Rembele, Bener Meriah.',
        lat: 4.7386, lng: 96.9806,
        featured: false
      },
      {
        id: 'dest-012',
        name: 'Masjid Agung Babussalam',
        category: 'religious',
        region: 'Bener Meriah',
        description: 'Masjid agung kebanggaan Kabupaten Bener Meriah dengan arsitektur anggun, halaman luas, dan suasana ibadah yang khusyuk.',
        descriptionEn: 'The grand mosque of Bener Meriah, admired for its graceful architecture, spacious grounds, and serene atmosphere for prayer.',
        imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
          './images/pantan-terong.jpg'
        ],
        address: 'Simpang Tiga Redelong, Kec. Bukit, Kabupaten Bener Meriah',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.7253,96.8467',
        estimatedCost: 0,
        facilities: ['Parkir Luas', 'Taman Halaman', 'Toilet Bersih', 'Akses Ramah Lansia'],
        prayerFacilities: ['Ruang Salat Utama Luas', 'Tempat Wudhu Terpisah', 'Perlengkapan Salat Bersih'],
        accessInfo: 'Terletak strategis di pusat pemerintahan Simpang Tiga Redelong.',
        lat: 4.7253, lng: 96.8467,
        featured: false
      },
      {
        id: 'dest-013',
        name: 'Museum Aceh & Rumoh Aceh',
        category: 'cultural',
        region: 'Banda Aceh',
        description: 'Kompleks cagar budaya yang menampilkan Rumoh Aceh tradisional berukir indah, Lonceng Cakra Donya, dan koleksi warisan Kesultanan Aceh.',
        descriptionEn: 'A heritage complex preserving the intricately carved traditional Rumoh Aceh house, Cakra Donya Bell, and Sultanate artifacts.',
        imageUrl: './images/rumoh-aceh.jpg',
        gallery: [
          './images/rumoh-aceh.jpg',
          './images/museum-tsunami.jpg'
        ],
        address: 'Jl. Sultan Alaiddin Mahmudsyah No.10, Banda Aceh',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=5.5489,95.3212',
        estimatedCost: 10000,
        facilities: ['Rumoh Aceh Asli', 'Galeri Etnografi', 'Taman Rindang', 'Pemandu Budaya'],
        prayerFacilities: ['Mushola Kompleks Museum', 'Dekat Masjid Raya Baiturrahman (±800m)'],
        accessInfo: 'Berada di pusat kota, ±5 menit berkendara dari Lapangan Blang Padang.',
        lat: 5.5489, lng: 95.3212,
        featured: false
      },
      {
        id: 'dest-014',
        name: 'Wisata Kebun Kopi Gayo',
        category: 'culinary',
        region: 'Aceh Tengah',
        description: 'Pengalaman edukasi panen hingga seduh kopi Arabika Gayo langsung di kebun petani lokal dengan panorama pegunungan.',
        descriptionEn: 'An authentic farm-to-cup experience exploring organic Gayo Arabica coffee plantations and traditional roasting.',
        imageUrl: './images/kopi-sanger.jpg',
        gallery: [
          './images/kopi-sanger.jpg',
          './images/pantan-terong.jpg'
        ],
        address: 'Kec. Pegasing, Kabupaten Aceh Tengah',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=4.5880,96.8350',
        estimatedCost: 35000,
        facilities: ['Tur Kebun Kopi', 'Ruang Cupping & Seduh', 'Gerai Biji Kopi UMKM', 'Parkir'],
        prayerFacilities: ['Mushola Kebun', 'Air Wudhu Bersih'],
        accessInfo: '±15 menit dari pusat Kota Takengon.',
        lat: 4.5880, lng: 96.8350,
        featured: false
      }
    ],

    culinary: [
      {
        id: 'food-001',
        ownerId: 'user-partner-1',
        name: 'Mie Aceh Kepiting & Daging',
        category: 'traditional',
        region: 'Banda Aceh',
        price: 35000,
        description: 'Mie kuning tebal dimasak dengan racikan rempah kari khas Aceh, disajikan goreng, tumis, atau kuah bersama acar bawang merah.',
        imageUrl: './images/mie-aceh.jpg',
        halalStatus: 'certified',
        verificationSource: 'Sertifikat Halal BPJPH / MPU Aceh No. ID1111000421',
        contact: '6281200001001'
      },
      {
        id: 'food-002',
        ownerId: 'user-partner-1',
        name: 'Kopi Sanger Arabika Gayo',
        category: 'beverage',
        region: 'Banda Aceh',
        price: 15000,
        description: 'Perpaduan kopi saring khas Aceh dengan susu kental manis bertekstur lembut, disajikan hangat maupun dingin.',
        imageUrl: './images/kopi-sanger.jpg',
        halalStatus: 'certified',
        verificationSource: 'Sertifikat Halal UMKM Banda Aceh No. ID1111000882',
        contact: '6281200001002'
      },
      {
        id: 'food-003',
        ownerId: 'user-partner-1',
        name: 'Ayam Tangkap Khas Aceh Besar',
        category: 'traditional',
        region: 'Aceh Besar',
        price: 45000,
        description: 'Potongan ayam kampung berbumbu rempah yang digoreng renyah bersama daun kari, daun pandan, dan cabai hijau.',
        imageUrl: './images/ayam-tangkap.jpg',
        halalStatus: 'pending_verification',
        verificationSource: 'Pengajuan Sertifikat MPU Aceh #REQ-2026-041',
        contact: '6281200001003'
      },
      {
        id: 'food-004',
        ownerId: null,
        name: 'Sate Gurita Pulau Weh',
        category: 'seafood',
        region: 'Sabang',
        price: 30000,
        description: 'Kuliner pesisir khas Sabang berbahan gurita segar bakar dengan bumbu kacang gurih atau bumbu padang pedas manis.',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        halalStatus: 'not_verified',
        verificationSource: null,
        contact: '6281200001004'
      },
      {
        id: 'food-005',
        ownerId: 'user-partner-1',
        name: 'Masam Jing Ikan Depik',
        category: 'traditional',
        region: 'Aceh Tengah',
        price: 40000,
        description: 'Hidangan tradisional Gayo berkuah asam pedas segar dari ikan depik endemik Danau Laut Tawar.',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
        halalStatus: 'pending_verification',
        verificationSource: 'Menunggu verifikasi dokumen UMKM Gayo #REQ-2026-045',
        contact: '6281200001005'
      },
      {
        id: 'food-006',
        ownerId: 'user-partner-1',
        name: 'Biji Kopi Gayo UMKM Redelong',
        category: 'umkm',
        region: 'Bener Meriah',
        price: 85000,
        description: 'Kopi Arabika Gayo single-origin sangrai medium kemasan 250g dari koperasi petani lokal Bener Meriah.',
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
        halalStatus: 'certified',
        verificationSource: 'Sertifikat Halal BPJPH Reg. ID1121000142',
        contact: '6281200001006'
      },
      {
        id: 'food-007',
        ownerId: null,
        name: 'Kue Timphan Labu & Srikaya',
        category: 'snack',
        region: 'Banda Aceh',
        price: 25000,
        description: 'Kue tradisional berbalut daun pisang muda berisi srikaya lembut, oleh-oleh autentik buatan ibu-ibu UMKM.',
        imageUrl: './images/kue-timphan.jpg',
        halalStatus: 'not_verified',
        verificationSource: null,
        contact: '6281200001007'
      },
      {
        id: 'food-008',
        ownerId: null,
        name: 'Kuah Pliek U Tradisional',
        category: 'traditional',
        region: 'Aceh Besar',
        price: 28000,
        description: 'Sayur gulai khas Aceh kaya rempah dan kelapa fermentasi (pliek u) dengan beragam sayuran segar lokal.',
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        halalStatus: 'certified',
        verificationSource: 'Sertifikat Halal MPU Aceh No. ID1112000219',
        contact: '6281200001008'
      }
    ],

    accommodations: [
      {
        id: 'stay-001',
        ownerId: 'user-partner-1',
        name: 'Serambi Heritage Syariah Hotel',
        region: 'Banda Aceh',
        pricePerNight: 480000,
        description: 'Hotel bernuansa hangat dan tenang hanya beberapa menit dari Masjid Raya Baiturrahman.',
        facilities: ['Wi-Fi Cepat', 'AC', 'Sarapan Lokal', 'Parkir Gratis', 'Layanan Antar Bandara'],
        muslimFriendlyFacilities: ['Penunjuk Arah Kiblat di Kamar', 'Sajadah & Al-Qur’an Tersedia', 'Masjid Raya ±600m', 'Dapur Ramah Muslim'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
        contact: '6281200002001'
      },
      {
        id: 'stay-002',
        ownerId: null,
        name: 'Iboih Pine & Sea Eco Bungalow',
        region: 'Sabang',
        pricePerNight: 550000,
        description: 'Bungalow kayu ramah lingkungan menghadap teluk biru Iboih dengan balkon pribadi yang teduh.',
        facilities: ['Balkon Laut', 'AC', 'Wi-Fi', 'Akses Snorkeling', 'Restoran Tepi Pantai'],
        muslimFriendlyFacilities: ['Penunjuk Arah Kiblat', 'Perlengkapan Salat di Kamar', 'Info Jadwal Salat & Masjid Gampong Iboih (±300m)'],
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
        contact: '6281200002002'
      },
      {
        id: 'stay-003',
        ownerId: null,
        name: 'Lampuuk Coastal Villa',
        region: 'Aceh Besar',
        pricePerNight: 420000,
        description: 'Penginapan tepi pantai bergaya minimalis alami dengan taman tropis dan suara ombak yang menenangkan.',
        facilities: ['Taman Tropis', 'Kamar Keluarga', 'Area BBQ', 'Parkir Luas', 'Wi-Fi'],
        muslimFriendlyFacilities: ['Arah Kiblat Jelas', 'Ruang Salat Bersama', 'Masjid Rahmatullah ±1.2 km'],
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
        contact: '6281200002003'
      },
      {
        id: 'stay-004',
        ownerId: 'user-partner-1',
        name: 'Takengon Highland Lake Lodge',
        region: 'Aceh Tengah',
        pricePerNight: 520000,
        description: 'Pondok kayu hangat berlatar Danau Laut Tawar dengan udara pegunungan sejuk dan sajian kopi Gayo.',
        facilities: ['Pemandangan Danau', 'Air Hangat', 'Kedai Kopi Gayo', 'Wi-Fi', 'Parkir'],
        muslimFriendlyFacilities: ['Arah Kiblat di Setiap Kamar', 'Sajadah & Mukena', 'Mushola Lodge', 'Masjid Terdekat ±1.5 km'],
        imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80',
        contact: '6281200002004'
      },
      {
        id: 'stay-005',
        ownerId: 'user-partner-1',
        name: 'Redelong Coffee Estate Homestay',
        region: 'Bener Meriah',
        pricePerNight: 320000,
        description: 'Homestay keluarga di tengah kebun kopi Bener Meriah dengan suasana tenang dan keramahan warga lokal.',
        facilities: ['Air Hangat', 'Sarapan Tradisional', 'Tur Kebun Kopi', 'Parkir Gratis'],
        muslimFriendlyFacilities: ['Arah Kiblat', 'Alat Salat Bersih', 'Dekat Masjid Agung Babussalam (±2 km)'],
        imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=900&q=80',
        contact: '6281200002005'
      },
      {
        id: 'stay-006',
        ownerId: null,
        name: 'Weh Tranquil Cottage',
        region: 'Sabang',
        pricePerNight: 390000,
        description: 'Cottage minimalis tenang di antara pepohonan kelapa dengan akses mudah menuju Pantai Sumur Tiga.',
        facilities: ['AC', 'Wi-Fi', 'Sewa Motor', 'Teras Taman'],
        muslimFriendlyFacilities: ['Arah Kiblat', 'Perlengkapan Salat', 'Info Masjid & Kuliner Halal Terdekat'],
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
        contact: '6281200002006'
      }
    ],

    packages: [
      {
        id: 'package-001',
        name: 'Banda Aceh Heritage & Halal Trail',
        duration: 2,
        destinations: ['dest-001', 'dest-002', 'dest-013', 'dest-003'],
        estimatedCost: 950000,
        description: 'Perjalanan 2 hari menyusuri jejak sejarah, arsitektur Masjid Raya Baiturrahman, Rumoh Aceh, dan senja di Pantai Lampuuk.',
        interests: ['religious', 'historical', 'cultural', 'marine'],
        imageUrl: './images/masjid-baiturrahman.jpg'
      },
      {
        id: 'package-002',
        name: 'Sabang Marine Sanctuary Escape',
        duration: 3,
        destinations: ['dest-005', 'dest-006', 'dest-001'],
        estimatedCost: 1850000,
        description: 'Liburan bahari 3 hari menikmati kejernihan Pantai Iboih, keindahan alam Pulau Weh, dan kuliner laut Sabang.',
        interests: ['marine', 'nature'],
        imageUrl: './images/pantai-iboih-sabang.jpg'
      },
      {
        id: 'package-003',
        name: 'Gayo Highlands & Coffee Retreat',
        duration: 3,
        destinations: ['dest-007', 'dest-008', 'dest-014', 'dest-010'],
        estimatedCost: 1450000,
        description: 'Menyegarkan pikiran 3 hari di Danau Laut Tawar, Pantan Terong, Bur Telege, dan tur kebun kopi Arabika Gayo.',
        interests: ['nature', 'culinary'],
        imageUrl: './images/danau-laut-tawar.jpg'
      },
      {
        id: 'package-004',
        name: 'Aceh Coastal Day Trip',
        duration: 1,
        destinations: ['dest-003', 'dest-004', 'dest-001'],
        estimatedCost: 450000,
        description: 'Wisata singkat 1 hari menikmati pesisir Aceh Besar dari Lampuuk hingga Lhoknga dan kuliner tradisional.',
        interests: ['marine', 'culinary', 'religious'],
        imageUrl: './images/pantai-lampuuk.jpg'
      },
      {
        id: 'package-005',
        name: 'Grand Aceh Nature & Culture Journey',
        duration: 5,
        destinations: ['dest-001', 'dest-002', 'dest-005', 'dest-006', 'dest-007', 'dest-011'],
        estimatedCost: 3200000,
        description: 'Eksplorasi menyeluruh 5 hari menggabungkan kota sejarah Banda Aceh, bahari Pulau Weh, dan pegunungan Gayo–Bener Meriah.',
        interests: ['nature', 'marine', 'religious', 'historical', 'cultural'],
        imageUrl: './images/pantan-terong.jpg'
      }
    ],

    itineraries: [
      {
        id: 'trip-001',
        userId: 'user-traveler-1',
        tripName: 'Jelajah Tenang Banda Aceh & Sabang',
        startDate: '2026-12-10',
        duration: 3,
        travelers: 2,
        activities: [
          { day: 1, destinationId: 'dest-001', activity: 'Kunjungan pagi & salat Zuhur di Masjid Raya Baiturrahman' },
          { day: 1, destinationId: 'dest-002', activity: 'Edukasi sejarah di Museum Tsunami Aceh' },
          { day: 2, destinationId: 'dest-005', activity: 'Penyeberangan kapal cepat ke Pulau Weh, Sabang' },
          { day: 2, destinationId: 'dest-006', activity: 'Snorkeling santai di teluk jernih Pantai Iboih' },
          { day: 3, destinationId: 'dest-003', activity: 'Menikmati senja dan ikan bakar di Pantai Lampuuk' }
        ],
        totalBudget: 2450000
      }
    ],

    favorites: [
      { id: 'fav-001', userId: 'user-traveler-1', itemId: 'dest-001', itemType: 'destination', dateAdded: '2026-11-20' },
      { id: 'fav-002', userId: 'user-traveler-1', itemId: 'dest-007', itemType: 'destination', dateAdded: '2026-11-22' }
    ],

    reviews: [
      {
        id: 'rev-001',
        destinationId: 'dest-001',
        userId: 'user-traveler-1',
        userName: 'Aisyah Rahma',
        rating: 5,
        comment: 'Pelataran dengan payung elektrik sangat teduh saat Zuhur. Tempat wudhu bersih, luas, dan ramah keluarga.',
        createdAt: '2026-11-18'
      },
      {
        id: 'rev-002',
        destinationId: 'dest-007',
        userId: 'user-traveler-1',
        userName: 'Aisyah Rahma',
        rating: 5,
        comment: 'Kabut pagi di Danau Laut Tawar luar biasa tenang. Sangat cocok untuk healing sambil menikmati kopi Gayo hangat.',
        createdAt: '2026-11-21'
      }
    ],

    inquiries: [
      {
        id: 'inq-001',
        userId: 'user-traveler-1',
        userName: 'Aisyah Rahma',
        userEmail: 'wisatawan@ranum.id',
        ownerId: 'user-partner-1',
        itemId: 'stay-004',
        itemType: 'accommodation',
        itemName: 'Takengon Highland Lake Lodge',
        date: '2026-12-12',
        guests: 2,
        note: 'Mohon info ketersediaan kamar menghadap danau untuk 2 malam.',
        status: 'pending',
        createdAt: '2026-11-24'
      }
    ],

    preferences: {
      language: 'id',
      activeItineraryId: 'trip-001',
      currentUserId: null // null = Guest mode by default
    }
  };
}
