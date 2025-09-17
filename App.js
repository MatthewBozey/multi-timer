import TimerItem from './components/TimerItem.js';

const { createApp, ref, watch } = Vue;

const App = {
  components: { TimerItem, TimePicker: window.Vue3Timepicker.TimePicker },
  template: `
    <div class="max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-center">🎯 Мультитаймер</h1>

      <div class="flex flex-col md:flex-row gap-2 mb-6 items-center">
        <input v-model="newTitle" type="text" placeholder="Название таймера"
               class="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none" />

        <TimePicker v-model="newTime" format="HH:mm:ss" :auto-close="true" class="w-36" />

        <button @click="addTimer"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">Добавить</button>
      </div>

      <div v-if="timers.length" class="flex flex-wrap gap-4 justify-center">
        <TimerItem v-for="timer in timers" :key="timer.id" :timer="timer"
                   @update="updateTimer" @remove="removeTimer(timer.id)" />
      </div>

      <p v-else class="text-center text-gray-400">Таймеров пока нет.</p>
    </div>
  `,
  setup() {
    const timers = ref(JSON.parse(localStorage.getItem("timers") || "[]"));
    const newTitle = ref("");
    const newTime = ref("00:05:00");
    
    function timeToSeconds(str){
      const parts = str.split(":").map(Number);
      let h=0,m=0,s=0;
      if(parts.length===3) [h,m,s]=parts;
      else if(parts.length===2) [m,s]=parts;
      else if(parts.length===1) s=parts[0];
      return h*3600 + m*60 + s;
    }
    
    function addTimer(){
      const seconds = timeToSeconds(newTime.value);
      if(!newTitle.value || seconds<=0) return;
      timers.value.push({ id:Date.now(), title:newTitle.value, seconds, soundUrl:null });
      newTitle.value="";
      newTime.value="00:05:00";
    }
    
    function updateTimer(updated){
      const idx = timers.value.findIndex(t=>t.id===updated.id);
      if(idx!==-1) timers.value[idx]=updated;
    }
    
    function removeTimer(id){
      timers.value = timers.value.filter(t=>t.id!==id);
    }
    
    watch(timers, ()=>localStorage.setItem("timers", JSON.stringify(timers.value)), {deep:true});
    
    return { timers, newTitle, newTime, addTimer, updateTimer, removeTimer };
  }
};

createApp(App).mount('#app');
