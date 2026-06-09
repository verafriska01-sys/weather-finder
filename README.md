# WeatherFinder — Pertemuan 10 Praktikum

Aplikasi cuaca real-time React Native + Expo yang
mendemonstrasikan useEffect, debounce, dan integrasi API.

## Fitur
- Cari cuaca berdasarkan nama kota
- Debounce 500ms (hemat request)
- 4 kondisi UI: kosong / loading / error / sukses
- Data dari Open-Meteo (gratis, tanpa API key)

## Konsep yang Dipakai
- useState (4 state), useEffect (dependency array)
- Debounce dengan setTimeout + clearTimeout
- AbortController untuk cleanup & anti race-condition
- Conditional rendering dengan operator &&

## Cara Menjalankan
1. npm install
2. npx expo start
3. Scan QR dengan Expo Go

## Link
- Expo Snack: [https://snack.expo.dev/@verafriska/courageous-orange-almond]

## Screenshot
![Kondisi Awal](<img width="1080" height="2400" alt="tampilan awal" src="https://github.com/user-attachments/assets/86bfb783-78d2-4596-809a-d06e542ab2a4" />)

![Loading](<img width="1080" height="2400" alt="loading surabaya" src="https://github.com/user-attachments/assets/ffa17f2d-081f-4864-b81f-0d7a1b11ff5d" />)

![Hasil](<img width="720" height="1600" alt="jakarta" src="https://github.com/user-attachments/assets/0c0ebf65-acf7-476e-8189-bdb5ee8e2796" />)

error (<img width="1080" height="2400" alt="eror" src="https://github.com/user-attachments/assets/db83af02-7420-40e1-86c8-133d8f553a2e" />)

## Author
[Vera Friska Telaumbanua] - [243303621211] - Universitas Prima Indonesia
