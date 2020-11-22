<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">     
      <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button>
                        <button type="button" class="btn btn-danger" @click="onStop">Stop Camera</button>
                        <button type="button" class="btn btn-success" @click="onStart">Start Camera</button>
                         <button type="button" class="btn btn-success" @click="onVideoLive">Video Live</button>
    </v-col>
    <v-col cols="12" sm="8" md="6">     
        <vue-web-cam
                            ref="webcam"
                            :device-id="deviceId"
                            width="100%"
                            @started="onStarted"
                            @stopped="onStopped"
                            @error="onError"
                            @cameras="onCameras"
                            @camera-change="onCameraChange"
                            @video-live="onVideoLive"
                        />
        <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import { WebCam } from "vue-web-cam";
Vue.use(WebCam);

export default {
    name: "App",
    components: {
        "vue-web-cam": WebCam
    },
    data() {
        return {
            img: null,
            camera: null,
            deviceId: null,
            devices: [],
            video:{},
            canvas:{},
            context2D:{},
        };
    },
    computed: {
        device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
        }
    },
    watch: {
        camera: function(id) {
            this.deviceId = id;
        },
        devices: function() {
            // Once we have a list select the first one
            const [first, ...tail] = this.devices;
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        }
    },
    methods: {
        onCapture() {
            this.img = this.$refs.webcam.capture();
        },
        onStarted(stream) {
            console.log("On Started Event", stream);
        },
        onStopped(stream) {
            console.log("On Stopped Event", stream);
        },
        onStop() {
            this.$refs.webcam.stop();
        },
        onStart() {
            this.$refs.webcam.start();
        },
        onError(error) {
            console.log("On Error Event", error);
        },
        onCameras(cameras) {
            this.devices = cameras;
            console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            console.log("On Camera Change Event", deviceId);
        },
        onVideoLive(stream){
            this.$refs.webcam.videolive;
            console.log("On Video Live");
            this.draw();
        },
        async draw(){
           this.canvas = this.$refs.canvas;
            this.context2D = this.canvas.getContext("2d");
            this.context2D.beginPath();
                console.log("halo");
            this.context2D.font = "15pt sans-serif";
            this.context2D.fillStyle = "red";
            this.context2D.fillText("Halo",  (Math.random()*100)+ (Math.random()*100), (Math.random()*100) + (Math.random()*100));
            this.context2D.closePath();
             setTimeout(250);
        }

    }
};
</script>
<style scoped>
.canvas {
        width: 100%;
        height: 100%;
        top: 20;
        left: 0;
        position: absolute;
        /* background-color: white; */
        z-index: 10;
    }
</style>
