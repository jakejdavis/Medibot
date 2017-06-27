from flask import Flask, send_file, json, request, Response
from flask_cors import CORS, cross_origin
from gopigo import *
from subprocess import Popen, call
import os
import csv
from threading import Thread
from time import sleep
from camera import VideoCamera

app = Flask(__name__, static_folder='/')
CORS(app)

stop()
enable_servo()
led_off(1)


def siren():
    while True:
        led_on(1)
        led_off(2)
        time.sleep(0.25)
        led_on(2)
        led_off(1)


@app.route('/get_info')
def get_info():
    emergency_contacts = csv.DictReader(open('data/emergency_contact.csv.txt'))
    medical_information = csv.DictReader(open('data/medical_information.csv.txt'))

    emergency_contacts_list = []
    for item in emergency_contacts:
        emergency_contacts_list.append(item)

    medical_information_list = []
    for item in medical_information:
        medical_information_list.append(item)

    return json.dumps({"information": medical_information_list[0], "contacts": emergency_contacts_list})

@app.route('/move')
def move():
    direction = request.args.get('drcn')
    if direction == "forward":
        motor_fwd()
    elif direction == "backward":
        motor_bwd()
    elif direction == "left":
        left_rot()
    elif direction == "right":
        right_rot()
    return '200'

@app.route('/stop')
def stop_robot():
    print("stop")
    stop()
    return '200'

@app.route('/lights')
def lights():
    
    on_or_off = request.args.get('on')
    if on_or_off == "true":
        SIREN_THREAD.start()
    else:
        SIREN_THREAD.stop()

@app.route('/servo')
def change_servo():
    servo(int(request.args.get('pos')))
    return '200'


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    SERVO_POS = 90
    LED_ON = False
    SIREN_THREAD = Thread(target=siren)
    global SIREN_THREAD
    app.run(host="0.0.0.0")
