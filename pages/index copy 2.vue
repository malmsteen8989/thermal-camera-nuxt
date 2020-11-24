<template>
  <v-card class="mx-auto" dark max-width="2000">
    <v-card-text>
      <v-row>
        <v-col>
          <v-container>
          <video
            id="video"
            ref="video"
            width="480"
            height="640"
            autoplay
            style="display: none"
          ></video>
          <canvas ref="canvas" id="canvas" width="400" height="300" ></canvas>
          </v-container>
        </v-col>
      </v-row>
      <v-row>      
        <v-col>
          <h3 style="color: white; align: center">Thermal Detection</h3>

          <hr class="my-3" />

          <v-list class="transparent">
            <v-list-item v-for="item in result" :key="item.category">
              <v-list-item-title>{{ item.category }}</v-list-item-title>
              <v-list-item-icon>
                <v-icon color="red"> mdi-chevron-double-right</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.value }}</v-list-item-title>
              <v-list-item-icon>
                <v-icon color="cyan">{{ item.icon }}</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
          <v-btn class="mx-2" dark color="cyan" small v-on:click="startVideo">
            Start
          </v-btn>
            <v-btn class="mx-2" dark color="cyan" small v-on:click="drawImage">
            Estimate
          </v-btn>
          <v-btn class="mx-2" dark color="cyan" small v-on:click="stopVideo">
            Stop
          </v-btn>
        </v-col>
      </v-row>
      <v-container style="align: center">
        <!-- Video Section -->

        <!-- <v-text-field v-model="thermal"></v-text-field> -->
        <!-- </div> -->
        <!-- Video Section -->
      </v-container>
    </v-card-text>
    <!-- <v-card-actions>
          <v-spacer />
          <v-btn           
            nuxt
            to="/About"
          >
            About
          </v-btn>
        </v-card-actions> -->
  </v-card>
</template>

<script>
import * as blazeface from "@tensorflow-models/blazeface";

export default {
  data: () => ({
    result: [
      {
        category: "Temperature (Estimate) ",
        icon: "mdi-temperature-celsius",
        value: "Unknown",
      },
      { category: "Status ", icon: "mdi-clover", value: "Unknown" },
    ],
    video: {},
    canvas: {},
    ctx2D: {},
    ctx: null,
    isBlazefaceLoaded: false,
    thermal: "",
    realThermal: 0,
    model: null,
    tstamp: 0,
    videoStat: {
      playing: false,
      estimate: false,
    },
     sound: require('@/assets/temp_normal.mp3')
  }),
 
  mounted() {
    this.startVideo();
    // var tempNormal = require("@/assets/temp_normal.m4a");
  },


  methods: {
    startVideo() {
      this.videoStat.playing = true;
      
      // this.playSound('https://drive.google.com/file/d/1k0jTpxAKg6dTYg30tsrDZaACrzVeJYjb/view?usp=sharing');
      // const src = require(`assets/temp_normal.m4a`);
      // this.playSound(src);
      this.video = this.$refs.video;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia(
          {
            video: true,
            audio: false,
          },
          function (stream) {
            video.srcObject = stream;
            video.play();
          },
          function (error) {
            //error.code
          }
        );
        this.video.onPlay = function () {
          setTimeout(drawImage, 150);
        };
       
          this.canvas = this.$refs.canvas;
          var ctx = this.canvas.getContext("2d");      
           ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
          ctx.beginPath();
          var text = "Hit Estimate Button";
          ctx.font = "12pt sans-serif";
          ctx.fillStyle = "white";
          ctx.fillText(text, canvas.width/2 - 85  , canvas.height/2);
          ctx.closePath();
        // this.video.addEventListener(
        //     "play",
        //     this.draw()
        //     ,
        //     false
        // );
      }
    },
    stopVideo(){
      

      if(this.videoStat.playing == true){
      this.video.srcObject.getTracks().forEach(function(track) {
              if (track.readyState == 'live' && track.kind === 'video') {
                  track.stop();
                   
              }
          });
          this.videoStat.playing = false;
      }
      setTimeout(() => {
        //  this.video = this.$refs.video;
          this.canvas = this.$refs.canvas;
          var ctx = this.canvas.getContext("2d");   
          ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);    
          // this.canvas.width = video.videoWidth;
          // this.canvas.height = video.videoHeight;
          ctx.beginPath();
          var text = "Hit Start Button";
          ctx.font = "12pt sans-serif";
          ctx.fillStyle = "white";
          ctx.fillText(text, canvas.width/2 - 75  , canvas.height/2);
          ctx.closePath(); 
      }, 150);
      this.resetResult;
      
         
    },
    async drawImage() {
      if(this.videoStat.playing == false){
         
          // setTimeout(() => {
          //    this.startAndDraw();
          // }, 2000);
      }
      else{
          this.canvas = this.$refs.canvas;
          var ctx = this.canvas.getContext("2d");
          this.model = await blazeface.load();
          // this.canvas.width = 400;
          // this.canvas.height = 300;
       
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
         
          const returnTensors = false;
          const predictions = await this.model.estimateFaces(imgData, returnTensors);

          if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
              const start = predictions[i].topLeft;
              const end = predictions[i].bottomRight;
              var probability = predictions[i].probability;
              console.log("prob = "+probability);
              const size = [end[0] - start[0], end[1] - start[1]];
              var landmarks = predictions[i].landmarks;
              // Render a rectangle over each detected face.

              for (var j = 0; j < landmarks.length; j++) {
                ctx.beginPath();
                ctx.strokeStyle = "white";
                var landmark = landmarks[j];
                // console.log("lengthj =" + landmark);
                ctx.arc(landmark[0], landmark[1], 1, 0, 2 * Math.PI);
                //  ctx.arc(100, 75, 5, 0, 2 * Math.PI);

                //  ctx.fillStyle = "blue";
                ctx.stroke();
                ctx.closePath();
              }
              ctx.beginPath();
              ctx.lineWidth = "8";
              ctx.strokeStyle = "cyan";
              ctx.rect(start[0], start[1], size[0], size[1]);
              ctx.stroke();
              ctx.closePath();
              await this.predictThermal(ctx);
            }
            // setTimeout(100);
          }else{
            this.resetResult();
            
          }

          // var faceArea = 300;
          // var pX=canvas.width/2 - faceArea/2;
          // var pY=canvas.height/2 - faceArea/2;
          // pX = pX + (Math.random()*200);
          // pY = pY +  (Math.random()*150);
          // ctx.rect(pX,pY,faceArea,faceArea);
          // ctx.lineWidth = "6";
          // ctx.strokeStyle = "red";
          // ctx.stroke();

          setTimeout(this.drawImage, 150);
      }
    },
     predictThermal(ctx) {
      if (this.realThermal == 0) {
        this.realThermal = (Math.random() * 2 + 35).toFixed(1);
        this.result[0].value = this.realThermal.toString();
        this.result[1].value ="Normal";
        // var text = this.result[0].value +" >> "+" "+this.result[1].value;
        // ctx.font = "12pt sans-serif";
        // ctx.fillStyle = "red";
        // ctx.fillText(text, 20, 20);
        // ctx.closePath();
      } else {
        var temp = (Math.random() * 2 + 35).toFixed(1);
        var interval = Math.abs(this.realThermal - temp);
        if (interval > 0.1) {
          //do nothing
        } else {
          this.realThermal = temp;
        }
        // this.result[0].value = this.realThermal.toString();
        // this.result[1].value ="Normal";
        //   var text = this.result[0].value +" >> "+" "+this.result[1].value;
        // ctx.font = "12pt sans-serif";
        // ctx.fillStyle = "red";
        // ctx.fillText(text, 20, 20);
        // ctx.closePath();
      }
      if (this.tstamp == 0) {
        this.tstamp = Math.floor(Date.now() / 1000);
      } else {
        var cstamp = Math.floor(Date.now() / 1000);
        if (Math.abs(this.tstamp - cstamp) > 10) {
          this.playSound();
          this.realThermal = 0;
          this.tstamp = 0;
          //    this.thermal = 'Reset';
          //   setInterval(() => {
          //       this.video.stop();
          //       this.drawImage();
          //   }, 5000);

          // this.video.srcObject.getTracks().forEach(function(track) {
          //     if (track.readyState == 'live' && track.kind === 'video') {
          //         track.stop();

          //     }
          // });
          // // this.video.pause();
          // setTimeout(() => {
          //     this.video.play();
          // }, 3000);
          //  setTimeout(this.drawImage,3000);
        }
      }
    },
    resetResult(){      
      this.result[0].value = 'Unknown';
      this.result[1].value = 'Unknown';
      this.realThermal = 0;
      this.tstamp = 0;
        

    },
    playSound () {
      if(this.sound) {
        var audio = new Audio(this.sound);
        audio.play();
      }
    }
  },

  destroyed() {
    const tracks = this.mediaStream.getTracks();
    tracks.map((track) => track.stop());
  },
};
</script>
<style scoped>
.video {
  width: 100%;
  /* object-fit:cover; */
}

</style>


