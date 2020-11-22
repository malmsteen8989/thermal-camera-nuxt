<template>
   <div>
       <video id="video" ref="video" width="640" height="480" autoplay></video>
       <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
   </div>
</template>

<script>

export default {
    data: function() {
        return {
            video:{},
            canvas:{},
        }
    },
    
    mounted() {
         this.canvas = this.$refs.canvas;
			var context = this.canvas
				.getContext("2d");
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
            this.video.addEventListener(
                "play",                         
                this.draw()
                ,
                false
            );
        }

},
watch:{
    
},
    
    methods: {
        async draw(){
          
            context.font = "15pt sans-serif";
            context.fillStyle = "red";
            context.fillText("Halo", 10 + 5, 10 + 20);
            context.closePath();
        }
       
    },
    destroyed () {
        const tracks = this.mediaStream.getTracks()
        tracks.map(track => track.stop())
    }
}
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
