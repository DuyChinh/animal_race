<template>
    <div class="zoom_duck">
        <!-- <h1>Duck race</h1> -->
        <!-- <video autoplay muted loop class="background_video">
            <source src="../../assets/video/river.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video> -->
        <button class="btn btn-warning btn-bet" @click="showModal = true" v-if="remainTime >=0">Set bet</button>
        <p class="remain_time" v-if="remainTime >= 0">{{ remainTime }}</p>
        <p class="point">
            <img :src="wallet" class="card-img-top icon-point" alt="...">
            wallet: <strong class="text-warning">{{ point }}</strong> 
            <img :src="dollar" class="card-img-top icon-point" alt="...">
        </p>

        <div class="d-flex flex-column duck_block">
            <div class="duck_parent">
                <img :src="duck" class="card-img-top icon_race" alt="..."> 
                <span class="duck_num">1</span>
            </div>
    
            <div class="duck_parent">
                <img :src="duck" class="card-img-top icon_race" alt="..."> 
                <span class="duck_num">2</span>
            </div>

            <div class="duck_parent">
                <img :src="duck" class="card-img-top icon_race" alt="..."> 
                <span class="duck_num">3</span>
            </div>

            <div class="duck_parent">
                <img :src="duck" class="card-img-top icon_race" alt="..."> 
                <span class="duck_num">4</span>
            </div>

            <div class="duck_parent">
                <img :src="duck" class="card-img-top icon_race" alt="..."> 
                <span class="duck_num">5</span>
            </div>
        </div>
    </div>

    <div class="modal modal-overlay" :class="{ show: showModal }"  aria-labelledby="exampleModalLabel" aria-hidden="true" tabindex="-1" style="display: block" v-if="showModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" style="color: brown;"><i class="bi bi-check2-circle" style="font-size: 27px;"></i> Choose duck</h5> 
                <button
                    type="button"
                    class="btn-close"
                    @click="closeModal"
                    aria-label="Close"
                ></button>
                </div>
                <div class="modal-body">
                    <div class="form-floating mb-3">
                        <input v-model="duck_select" class="form-control" id="floatingInput" placeholder="david">
                        <label for="floatingInput">Select duck(1-5)</label>
                    </div>

                    <div class="form-floating mt-3">
                        <input v-model="amount" class="form-control" id="floatingInput" placeholder="david">
                        <label for="floatingInput">Bet amount</label>
                    </div>
                </div>
                <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    @click="closeModal"
                >
                    Cancel
                </button>
                <button type="button" class="btn btn-primary" @click="setBet(duck_select, amount)">Set bet</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import duck from "../../assets/img/duck-toy.png"
import dollar from "../../assets/img/dollar.png"
import wallet from "../../assets/img/wallet.png"
import { ref, watch } from "vue";
const duck_select = ref();
const amount = ref();
const showModal = ref(false);
const remainTime = ref(0);
const statusRace = ref(false);
const point = ref();
const player_id = localStorage.getItem("player_id");
const socket = new WebSocket(`wss://pure-caverns-67534-35c6a327ed88.herokuapp.com/duckRace/race?playerId=${player_id}`);
socket.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server duckRace/race');
});

socket.addEventListener('message', function (event) {
    console.log(event.data);
    
    const type = event.data.split(",")[0].split(":")[1].trim();
    const time = event.data.split(",")[1].split(":")[1];
    remainTime.value = time.substring(0, time.length - 1);
    if(remainTime.value > 30) {
        // console.log("points", remainTime.value);
        
        point.value = remainTime.value;
    }
    // console.log("type= ",type);
    
    // if(type.toString() === "timer") {
    //     console.log("time in");
        
    //     console.log("time: ",time);
        
    // } else if(type === "points") {        
    //     const amount = event.data.split(",")[1].split(":")[1];
    //     point.value = amount.substring(0, amount.length - 1);
    //     console.log(point.value);
        
    // } else {
    //     console.log("type: ", typeof(type));
        
    //     console.log("no non nonono");
        
    // }
});

const closeModal = () => {
    showModal.value = false;
}

// watch(remainTime, (newValue) => {
//     console.log("time: ", newValue);

//     if(newValue === 1) {
//         // showModal.value = false;
//         closeModal();
//     }
// });

function setBet(duck_select, amount) {
    if (socket.readyState === WebSocket.OPEN) {
        console.log("Sending message to server...");
        const sendInfo = {
            "type": "placeBet",
            "candidateId": duck_select,
            "amount": amount,
        }
        socket.send(JSON.stringify(sendInfo));
    } else {
        console.error('WebSocket is not open');
    }
    showModal.value = false;
}

</script>

<style lang="css" scoped>
.point {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10px;
    background: brown;
    color: #fff;
}

.duck_block {
    position: absolute;
    top:260px;
}

.duck_parent {
    position: relative;
}

.duck_num {
    position: absolute;
    left: 0;
    top: 50%;
    display: block;
    width: 30px;
    height: 30px;
    background: #fff;
    border-radius: 50%;
    text-align: center;
}

.icon-point {
    width: 20px;
    height: 20px;
}

.btn-bet {
    position: absolute;
    top: 10;
    left: 48%;
}

.zoom_duck {
    position: relative;
    width: calc(100vw - 10px);
    height: calc(100vh - 100px);
    object-fit: cover;
    background-image: url("../../assets/img/riverriver.png");
    background-repeat: no-repeat;
    background-size: cover; 
    background-position: center; 
}

.remain_time {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #fff;
    font-size: 20px;
    background: #000;
    text-align: center;
    line-height: 50px;
}

/* .background_video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1; /* Keeps the video behind the content 
} */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.icon_race {
    margin-top: 12px;
    width: 95px;
    height: 95px;
    object-fit: cover;
}
</style>