#!/usr/bin/env python3
"""Ambil daftar aplikasi dari Google Sheets lalu simpan ke apps.json.

Dipakai saat build di Vercel (lihat vercel.json) atau manual:
    python3 build.py

Syarat: Sheet dibagikan "Anyone with the link" (Viewer).
Kolom: nama, url, kategori, platform, ikon, aktif
"""
import csv
import io
import json
import os
import sys
import urllib.request

SHEET_ID = os.environ.get("SHEET_ID", "1y8K1DVWHKwfN8-yvmoszNV3iY4YpeqUq1RH5sI25HwU")
URL = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps.json")
HEADER = ["nama", "url", "kategori", "platform", "ikon", "aktif"]


def fetch_rows():
    req = urllib.request.Request(URL, headers={"User-Agent": "portal-build/1.0"})
    with urllib.request.urlopen(req, timeout=20) as res:
        text = res.read().decode("utf-8")
    return list(csv.reader(io.StringIO(text)))


def clean(rows):
    out = [HEADER]
    for r in rows[1:]:
        r = (r + [""] * 6)[:6]
        nama, url = r[0].strip(), r[1].strip()
        if not nama or not url:
            continue
        if not url.startswith(("http://", "https://")):
            print(f"Dilewati (URL tidak valid): {nama}")
            continue
        out.append([nama, url, r[2].strip(), r[3].strip(), r[4].strip(), r[5].strip()])
    return out


def main():
    try:
        rows = clean(fetch_rows())
    except Exception as exc:  # jangan gagalkan deploy kalau Google sedang bermasalah
        print(f"Gagal membaca Sheet: {exc}")
        if "401" in str(exc) or "403" in str(exc):
            print("Sheet masih privat. Buka Share > General access > 'Anyone with the link' > Viewer.")
        if os.path.exists(OUT):
            print("Memakai apps.json yang sudah ada.")
        else:
            print("apps.json belum ada; deploy lanjut, halaman memakai data langsung dari Sheet / daftar cadangan.")
        return 0
    if len(rows) < 2:
        print("Sheet kosong, apps.json tidak diubah.")
        return 0
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=1)
    print(f"OK: {len(rows) - 1} aplikasi ditulis ke apps.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
