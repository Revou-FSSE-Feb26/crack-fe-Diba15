TODO 1 = Membuat halaman searching, untuk search berdasarkan nama, tags, dan artists. Search akan dibuat dengan prefix system, dimana prefix yang akan diterapkan adalah "title", tags:"tags-name", dan artists:"artists-name". (Clear)
TODO 2 = Tags yang diklik harus bisa di arahkan ke halaman search dengan filter yang sesuai. (Clear)
TODO 3 = Membuat action button on header artwork card berfungsi sepert salin link ke clipboard dan laporkan yang nantinya akan memunculkan modal untuk melaporkan artwork.
TODO 4 = Membuat modal global bukan hanya untuk melaporkan artwork namun juga untuk notifikasi ketika menampilkan teks biasa dan konfirmasi ketika melakukan aksi tertentu. (Clear)
TODO 5 = Menerapkan alur dummy commision, dimana nantinya user dapat melakukan commision pada artwork yang ditampilkan. Condition: User harus login terlebih dahulu. Jika belum login, maka tidak dapat melakukan commision dan diarahkan ke halaman login.
<!--Core Features-->
TODO 6 = Membuat halaman upload artwork untuk user. User juga bisa edit artwork yang sudah diupload.
TODO 7 = Membuat halaman progress commision yang menampilkan status commision yang sedang berlangsung. Berbeda untuk di halaman artists dan di halaman user yang membuat commission.
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