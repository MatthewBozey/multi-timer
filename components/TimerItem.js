const { ref, computed, onUnmounted } = Vue;

export default {
  props: ['timer'],
  emits: ['update','remove'],
  template: `
    <div class="bg-gray-800 p-3 rounded shadow w-56 flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold truncate">{{ timer.title }}</h2>
        <button @click="$emit('remove')" class="text-red-400 hover:text-red-500 text-sm">✕</button>
      </div>

      <p class="text-4xl text-center font-mono flex-1 flex items-center justify-center">{{ formattedTime }}</p>

      <div class="flex flex-wrap gap-2 justify-center">
        <button @click="start" :disabled="running"
                class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded flex items-center gap-1 text-sm">
          <i class="fas fa-play text-xs"></i> Старт
        </button>
        <button @click="pause" :disabled="!running"
                class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded flex items-center gap-1 text-sm">
          <i class="fas fa-pause text-xs"></i> Стоп
        </button>
        <button @click="reset"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1 text-sm">
          <i class="fas fa-redo text-xs"></i> Сброс
        </button>
      </div>

      <div class="mt-2 text-xs text-gray-300">
        <label class="block mb-1">Свой звук:</label>
        <input type="file" accept="audio/*" @change="onFileChange"
               class="block w-full text-xs text-gray-200 file:mr-1 file:py-0.5 file:px-2
                      file:rounded file:border-0 file:bg-indigo-600 file:text-white
                      hover:file:bg-indigo-700" />
      </div>
    </div>
  `,
  setup(props, { emit }) {
    const initialSeconds = props.timer.seconds;
    const timeLeft = ref(initialSeconds);
    const running = ref(false);
    let interval = null;
    let alarm = null;
    
    const formattedTime = computed(()=>{
      const h=Math.floor(timeLeft.value/3600);
      const m=Math.floor((timeLeft.value%3600)/60);
      const s=timeLeft.value%60;
      return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
    });
    
    function start(){
      if(running.value) return;
      running.value=true;
      interval = setInterval(()=>{
        if(timeLeft.value>0) timeLeft.value--;
        else {
          pause();
          playSound();
          timeLeft.value = initialSeconds;
        }
      },1000);
    }
    
    function pause(){
      running.value=false;
      clearInterval(interval);
    }
    
    function reset(){
      timeLeft.value = initialSeconds;
    }
    
    function onFileChange(e){
      const file = e.target.files[0];
      if(file){
        const url = URL.createObjectURL(file);
        props.timer.soundUrl = url;
        emit("update", {...props.timer});
      }
    }
    
    function playSound(){
      if(props.timer.soundUrl){
        alarm = new Audio(props.timer.soundUrl); alarm.play();
      } else {
        const beep = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
        beep.play();
      }
    }
    
    onUnmounted(()=>clearInterval(interval));
    
    return { timeLeft, running, formattedTime, start, pause, reset, onFileChange };
  }
};
