<template>
   <div class="videoContainer" >
       <video id="video" ref="video"  autoplay style="display: none"></video>
       <canvas ref="canvas" id="canvas"></canvas>
       <button id="snap" v-on:click="drawImage">Start</button>
       <v-text-field v-model="thermal"></v-text-field>
   </div>
</template>

<script>
import * as blazeface from "@tensorflow-models/blazeface";
export default {

    data: function() {
        return {
            video:{},
            canvas:{},
            ctx2D:{},
            ctx:null,
            isBlazefaceLoaded:false,
            thermal:"",
            realThermal:0,
            model:null,
            tstamp:0,
        }
    },
    // head(){
    //     return{
    //         title : "Thermal Camera Application",
    //         script:[
    //             {
    //                 hid:"tfjs-core",
    //                 src:'<https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core>',
    //                 defer:true,
                    
    //             },
    //              {
    //                 hid:"tfjs-converter",
    //                 src:'<https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter>',
    //                 defer:true,
                    
    //             },
    //             {
    //                 hid:"tfjs-models-blazeface",
    //                 src:'<https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface/>',
    //                 defer:true,
                    
    //             },

    //         ],
    //     }
    // },
    
    mounted() {    
    this.video = this.$refs.video;
   
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.getUserMedia(
                {
                    video:true,
                    audio:false,
                },
                function (stream){
                    video.srcObject = stream;
                    video.play();
                },
                function (error) {
                //error.code
                }
            ); 
            this.video.onPlay = function (){
                setTimeout(drawImage,100);
            };
            // this.video.addEventListener(
            //     "play",                         
            //     this.draw()
            //     ,
            //     false
            // );
            
        }

},
watch:{
    
},
    
    methods: {
        async drawImage(){
            this.video = this.$refs.video;
            this.canvas = this.$refs.canvas;
            var ctx = this.canvas.getContext('2d');
            this.model = await blazeface.load();
            this.canvas.width = video.videoWidth;
            this.canvas.height = video.videoHeight;


            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            
            const returnTensors = false;
            const predictions = await this.model.estimateFaces(video, returnTensors);

            if (predictions.length > 0) {
                for (let i = 0; i < predictions.length; i++) {
                    const start = predictions[i].topLeft;
                    const end = predictions[i].bottomRight;
                    var probability = predictions[i].probability;
                    const size = [end[0] - start[0], end[1] - start[1]];
                    var landmarks = predictions[i].landmarks;
                    // Render a rectangle over each detected face.

                    for (var j = 0; j < landmarks.length; j++) {
                    ctx.beginPath();
                    ctx.strokeStyle = "red";
                    var landmark = landmarks[j];
                    console.log("lengthj =" + landmark);
                    ctx.arc(landmark[0], landmark[1], 3, 0, 2 * Math.PI);
                    //  ctx.arc(100, 75, 5, 0, 2 * Math.PI);

                    //  ctx.fillStyle = "blue";
                    ctx.stroke();
                    ctx.closePath();
                    }
                    ctx.beginPath();
                    ctx.lineWidth = "8";
                    ctx.strokeStyle = "green";
                    ctx.rect(start[0], start[1], size[0], size[1]);
                    ctx.stroke();
                    ctx.closePath();
                    await this.predictThermal();
                   
                }
                // setTimeout(100);
            
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


            setTimeout(this.drawImage , 100);
        },
        async predictThermal(){
           if(this.realThermal == 0){
              this.realThermal = (Math.random() * 2 + 35).toFixed(1);
              this.thermal = this.realThermal.toString() + " C";
              
           }else{
              var temp = (Math.random() * 2 + 35).toFixed(1);
              var interval = Math.abs(this.realThermal-temp);    
              if (interval > 0.2){
                  //do nothing
              }else{
                 this.realThermal = temp; 
              }
              this.thermal = this.realThermal.toString() + " C";;
           }
           if(this.tstamp == 0){
               this.tstamp  = Math.floor(Date.now() / 1000);
           }else{
               var cstamp = Math.floor(Date.now() / 1000);
               if ((Math.abs(this.tstamp-cstamp)>5)){
                   this.realThermal = 0;
                   this.tstamp = 0;
                //    this.thermal = 'Reset';                   
                //   setInterval(() => {
                //       this.video.stop();
                //       this.drawImage();
                //   }, 5000);
                
                this.video.srcObject.getTracks().forEach(function(track) {
                    if (track.readyState == 'live' && track.kind === 'video') {
                        track.stop();
                       
                    }
                });
                // this.video.pause();
                setTimeout(() => {
                    this.video.play();
                }, 3000);
                 setTimeout(this.drawImage,3000);
                
                  
                  
                   
               }
           }
           
        },
        startVideo(){
            this.video.play();
        }
       
       
    },
    destroyed () {
        const tracks = this.mediaStream.getTracks()
        tracks.map(track => track.stop())
    }
}
</script>

<style scoped>
    .videoContainer {
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    width: 100%;   
 }
    .canvas {
        width: 100%;
        height: 100%;
        top: 20;
        left: 0;
        position: absolute;
        /* background-color: white; */
        z-index: 10;
    }
    .video {
        width: 100%;
        max-height: 100%;
    }
    
    .camera-modal-container {
        position: absolute;
        bottom: 0;
        width: 100%;
        align-items: center;
        margin-bottom: 24px;
    }

    .take-picture-button {
        display: block;
        margin: auto;
        margin-top: 20px;
    }
</style>
