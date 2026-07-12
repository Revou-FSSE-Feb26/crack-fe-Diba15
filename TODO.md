TODO 1 = Membuat halaman searching, untuk search berdasarkan nama, tags, dan artists. Search akan dibuat dengan prefix system, dimana prefix yang akan diterapkan adalah "title", tags:"tags-name", dan artists:"artists-name". (Clear)
TODO 2 = Tags yang diklik harus bisa di arahkan ke halaman search dengan filter yang sesuai. (Clear)
TODO 3 = Membuat action button on header artwork card berfungsi sepert salin link ke clipboard dan laporkan yang nantinya akan memunculkan modal untuk melaporkan artwork. (Clear)
TODO 4 = Membuat modal global bukan hanya untuk melaporkan artwork namun juga untuk notifikasi ketika menampilkan teks biasa dan konfirmasi ketika melakukan aksi tertentu. (Clear)
TODO 5 = Menerapkan alur dummy commision, dimana nantinya user dapat melakukan commision pada artwork yang ditampilkan. Condition: User harus login terlebih dahulu. Jika belum login, maka tidak dapat melakukan commision dan diarahkan ke halaman login. (Clear)
<!--Core Features-->
TODO 6 = Membuat halaman upload artwork untuk user. User juga bisa edit artwork yang sudah diupload. (Clear)
TODO 7 = Membuat halaman progress commision yang menampilkan status commision yang sedang berlangsung. Berbeda untuk di halaman artists dan di halaman user yang membuat commission. (Clear)
Requirements: 
User POV:
1. User yang melakukan commission dapat melihat status commision yang sedang berlangsung di halaman progress commision.
2. User yang melakukan commission dapat membatalkan commission yang sedang berlangsung. Dengan catatan commission tersebut tidak sesuai dengan yang diharapkan dan alasn logis lainnya.
3. User yang sudah membuat commission tidak dapat membatalkan commission yang sudah selesai.
4. User yang sudah membuat commission harus membayar uang muka terlebih dahulu sebelum commission dapat dijalankan
5. User yang sudah membuat commission dapat meninggalkan komentar untuk revisi dan request pada artists. (Opsional)
6. User hanya dapat melihat preview hasil serta WIP proof hasilnya, tidak dapat mendownload hasil commission.
7. User akan approve or not approve hasil commission yang sudah di upload oleh artists. Jika user menolak, dan bisa mengajukan dispute untuk mengembalikan uang muka. Karena uang muka sudah dibayar, maka user hanya bisa mengajukan dispute jika commission tidak sesuai dengan yang diharapkan.
8. User akan menerima hasil commission setelah selesai.

Artists POV:
1. Artists dapat menerima ataupun menolak commission dari user yang melakukan commission.
2. Artists dapat melihat progress commision dari user yang melakukan commission.
3. Artists dapat melihat komentar dari user yang melakukan commission.
4. Artists dapat membalas komentar dari user yang melakukan commission.
5. Artists diwajibkan mengupload hasil serta bukti bahwa hasil tersebut asli buatannya dengan WIP Proof.
6. Artis yang melanggar kepercayaan (submit karya AI, kualitas tidak sesuai deskripsi) dapat dilaporkan melalui mekanisme dispute, yang akan ditinjau admin dan berpengaruh pada strike_count artis tersebut.
7. Jika user sudah approve, maka uang muka yang sudah dibayar oleh user akan di kirim ke dalam wallet artis.

(HIGH)
TODO 8 = Menerapkan alur dispute commission, dimana user dapat mengajukan dispute jika commission tidak sesuai dengan yang diharapkan. (Clear)
Requirements:
1. User dapat mengajukan dispute ketika artist sudah upload hasil commission.
2. Alasan dispute harus diisi oleh user sebelum diajukan.
3. Untuk disetujui alasan dispute harus jelas dan terperinci.
4. Kurator dapat menyetujui atau menolak alasan dispute yang diajukan oleh user.
5. Client dapat melihat status dispute yang diajukan oleh mereka.
6. Dispute yang sudah diputuskan oleh kurator tidak dapat diubah lagi.
7. Dispute yang sudah diputuskan oleh kurator akan tercatat dalam riwayat dispute.
8. Dana yang sudah dibayar oleh client dapat ditarik kembali ke client jika dispute disetujui oleh kurator.
9. Jika dispute ditolak oleh kurator, maka dana yang sudah dibayar oleh client tidak dapat dikembalikan ke wallet client.
10. Jika dispute disetujui oleh kurator, tidak dapat melihat dan mendownload hasil yang sudah diupload oleh artis.
11. Tampilan dispute pada halaman kurator berbentuk tabel untuk melihat art, wip proof, alasan dispute, status dispute, dan tombol aksi.

(MID)
TODO 9 = Menerapkan alur laporan art melalui tombol laporkan (clear)
Requirements:
1. User (Client dan artist) dapat melaporkan art yang tidak sesuai dengan aturan trubrush.
2. Art yang dilaporkan harus dapat diidentifikasi (misalnya, melalui ID atau title art).
3. User dapat memberikan alasan laporan yang jelas dan terperinci.
4. Laporan yang diajukan oleh user akan tercatat dalam riwayat laporan.
5. Laporan yang sudah diajukan oleh user tidak dapat diubah lagi.
6. Laporan yang sudah diajukan oleh user akan diperiksa oleh kurator dan dapat disetujui atau ditolak oleh kurator.
7. Laporan yang sudah disetujui oleh kurator akan menambahkan strike_count ke akun artis yang dilaporkan.
8. Jika strike_count mencapai 5, akun artis akan diblokir dan tidak dapat mengunggah art lagi.
9. Akun artis yang diblokir tidak dapat mengunggah art lagi.
10. Tampilan laporan art pada halaman kurator berbentuk tabel untuk melihat art, alasan laporan, status laporan, dan tombol aksi.
11. Laporan art = laporan artist, jadi skenarionya jika ada yang melaporkan art yang tidak sesuai dengan aturan trubrush, maka laporan tersebut akan tercatat sebagai laporan kepada artist terkait.
12. Jadi tidak ada 2 laporan berbeda antara laporan art dan laporan artist. Hanya ada satu laporan yang tercatat sebagai laporan art dan laporan artist terkait.

(HIGH)
TODO 10 = Menerapkan alur verifikasi user dengan verifikasi art oleh kurator sebanyak 3/5 dari total art yang diunggah oleh artis. (Clear)
Requirements:
1. Setelah diunggah, artis harus melakukan verifikasi sebanyak 3/5 dari total art yang diunggah.
2. Kurator harus dapat melihat dan memverifikasi art yang diunggah oleh artis.
3. Kurator harus dapat menyetujui atau menolak verifikasi art oleh artis.
4. Art yang sudah diverifikasi oleh kurator akan ditampilkan pada feed, halaman artis dan dapat dilihat oleh artis.
5. Art yang belum diverifikasi oleh kurator tidak akan ditampilkan pada feed, halaman artis dan tidak dapat dilihat oleh artis.
6. Art yang sudah diverifikasi oleh kurator akan memiliki status "verified" dan art yang belum diverifikasi oleh kurator akan memiliki status "pending".
7. Setelah art yang sudah diverifikasi berjumlah 3/5 dari total art yang diunggah oleh artis, artis akan dinyatakan sebagai "verified" dan dapat menerima commission dari client.

(LOW)
TODO 11 = Membuat auto complete pada pencarian di navbar, mungkin menampilkan daftar seperti (Clear)
Contoh:
User Input : Fate
Suggestions:
- Fate
- chip artists: Fate
- chip tags: Fate

(HIGH)
TODO 12 = Menerapkan fitur follow artist untuk mengikuti artis.
Requirements:
1. User (Client dan artists) dapat mengikuti artis dengan mengklik tombol follow.
2. User dapat melihat daftar artis yang sedang diikuti mereka di halaman profile.
3. User dapat menghentikan pengikutiannya dengan mengklik tombol unfollow.
4. User dapat memfilter artwork nantinya di feed untuk beranda dan halaman followed artists.

(MID)
TODO 13 = Menerapkan fitur popular artist dan popular tags pada halaman feed.
Requirements:
1. Artis yang paling banyak diikuti oleh pengguna akan ditampilkan sebagai popular artist.
2. Tags yang paling sering digunakan oleh artis akan ditampilkan sebagai popular tags.
