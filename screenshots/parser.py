import cv2
import numpy as np
for name in ["1","2","3","4","5"]:
    base = cv2.imread(name + ".png",cv2.IMREAD_UNCHANGED)
    mat2 = base[102:102+750,0:1000, 0:3]
    cv2.imwrite(name + "parsed.png",mat2)
