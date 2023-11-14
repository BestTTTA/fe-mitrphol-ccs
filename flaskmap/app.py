from flask import Flask, send_file
from folium import Map
from folium.plugins import HeatMap
import requests
import threading
import time

app = Flask(__name__)

def update_map():
    while True:
        # ดึงข้อมูลจาก API
        response = requests.get('https://apilatlng.thetigerteamacademy.net/get_data/')
        data = response.json()

        # สมมติว่าข้อมูลล่าสุดอยู่ที่ตำแหน่งแรกของลิสต์
        latest_data = data[0]

        # สร้างแผนที่ด้วยตำแหน่งล่าสุด
        m = Map(location=[15.971240509494967, 102.62708789618164], zoom_start=7)

        # สร้างข้อมูลสำหรับ heatmap
        heatmap_data = [[item['latitude'], item['longitude'], item['ccs']] for item in data]

        # เพิ่ม heatmap ในแผนที่
        HeatMap(heatmap_data).add_to(m)

        # บันทึกแผนที่เป็นไฟล์ HTML
        m.save('map.html')

        # รอเวลาก่อนการอัปเดตถัดไป
        time.sleep(1)

@app.route('/')
def serve_map():
    return send_file('map.html')

if __name__ == '__main__':
    threading.Thread(target=update_map).start()
    app.run(host='0.0.0.0', port=3030)
