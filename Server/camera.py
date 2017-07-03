import cv2

class VideoCamera(object):
    def __init__(self):
        # Using OpenCV to capture from device 0.
        self.video = cv2.VideoCapture(0)
    
    def __del__(self):
        self.video.release()
    
    def get_frame(self):
        success, image = self.video.read()
        image = cv2.flip(cv2.flip(image, 1), 0)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY),50]
        ret, jpeg = cv2.imencode('.jpg', image, encode_param)
        
        return jpeg.tostring()
