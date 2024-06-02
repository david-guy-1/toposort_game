from pydub import AudioSegment
from pydub.playback import play
import playsound
import os
import os.path
for i in "abcdef":
    sound = AudioSegment.from_file(i+"b.mp3", format="mp3")
    sound -= 10
    sound.export(i+".mp3", format="mp3")
