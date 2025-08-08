import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import tw from 'twrnc';

const App = () => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Baixa');
  const [subtasks, setSubtasks] = useState({});
  const [newSubtask, setNewSubtask] = useState('');
  const [points, setPoints] = useState(0);
  const [trees, setTrees] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedApps, setBlockedApps] = useState([]);
  const [mood, setMood] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');

  // Pomodoro Timer Logic
  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            setPoints((prev) => prev + 10);
            setTrees((prev) => prev + 1);
            Alert.alert('FocusUp', 'Sessão Pomodoro concluída! Sua árvore cresceu! Faça uma pausa.');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Task Management
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, priority, completed: false }]);
      setNewTask('');
      setPriority('Baixa');
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    if (!tasks.find((task) => task.id === id).completed) {
      setPoints((prev) => prev + 5);
    }
  };

  const addSubtask = (taskId) => {
    if (newSubtask.trim()) {
      setSubtasks({
        ...subtasks,
        [taskId]: [...(subtasks[taskId] || []), { id: Date.now(), text: newSubtask, completed: false }],
      });
      setNewSubtask('');
    }
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setSubtasks({
      ...subtasks,
      [taskId]: subtasks[taskId].map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      ),
    });
  };

  // Distraction Blocker
  const toggleBlocker = () => {
    setIsBlocked(!isBlocked);
    Alert.alert(
      'FocusUp',
      isBlocked
        ? 'Bloqueador de distrações desativado.'
        : `Bloqueador de distrações ativado. Apps bloqueados: ${blockedApps.join(', ') || 'Nenhum'}.`
    );
  };

  const addBlockedApp = (app) => {
    if (app && !blockedApps.includes(app)) {
      setBlockedApps([...blockedApps, app]);
      return '';
    }
    return app;
  };

  // Mood Diary
  const logMood = () => {
    if (mood.trim()) {
      setMoodHistory([...moodHistory, { date: new Date().toLocaleDateString(), mood }]);
      setMood('');
      Alert.alert('FocusUp', 'Humor registrado! Continue cuidando de você.');
    }
  };

  // Calendar Integration (Mock)
  const addCalendarEvent = () => {
    if (newEvent.trim()) {
      setCalendarEvents([...calendarEvents, { id: Date.now(), text: newEvent }]);
      setNewEvent('');
      Alert.alert('FocusUp', 'Evento adicionado ao calendário!');
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-gradient-to-br from-[#8B5CF6] to-[#60A5FA] p-4`}>
      <View style={tw`w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-auto`}>
        <Text style={tw`text-3xl font-bold text-center text-[#8B5CF6] mb-6`}>FocusUp</Text>

        {/* Pomodoro Timer */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>Timer Pomodoro</Text>
          <Text style={tw`text-4xl font-mono text-center text-[#8B5CF6]`}>{formatTime(timeLeft)}</Text>
          <View style={tw`flex-row justify-center gap-4 mt-4`}>
            <TouchableOpacity
              style={tw`px-4 py-2 rounded-lg ${timerRunning ? 'bg-red-500' : 'bg-green-500'}`}
              onPress={() => setTimerRunning(!timerRunning)}
            >
              <Text style={tw`text-white font-semibold`}>{timerRunning ? 'Pausar' : 'Iniciar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`px-4 py-2 bg-gray-500 rounded-lg`}
              onPress={() => setTimeLeft(25 * 60)}
            >
              <Text style={tw`text-white font-semibold`}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
          <Text style={tw`text-center mt-4 text-[#FBBF24]`}>Árvores: {trees}</Text>
        </View>

        {/* Task Planner */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>Planejador</Text>
          <View style={tw`mb-4`}>
            <TextInput
              style={tw`p-2 border rounded-t-lg text-black`}
              value={newTask}
              onChangeText={setNewTask}
              placeholder="Adicionar nova tarefa"
              placeholderTextColor="#999"
            />
            <View style={tw`border mt-2`}>
              <TextInput
                style={tw`p-2 text-black`}
                value={priority}
                onChangeText={setPriority}
                placeholder="Prioridade"
                editable={false}
              />
              <View style={tw`absolute right-0 top-0 bottom-0 justify-center pr-2`}>
                <TextInput
                  style={tw`hidden`}
                  value={priority}
                  onChangeText={setPriority}
                  selectTextOnFocus={false}
                />
                <View style={tw`bg-white border rounded`}>
                  {['Baixa', 'Média', 'Alta'].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={tw`p-2`}
                      onPress={() => setPriority(opt)}
                    >
                      <Text style={tw`text-black`}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={tw`px-4 py-2 bg-[#8B5CF6] rounded-b-lg mt-2`}
              onPress={addTask}
            >
              <Text style={tw`text-white font-semibold text-center`}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`space-y-2`}>
            {tasks.map((task) => (
              <View key={task.id} style={tw`p-2 bg-gray-100 rounded-lg`}>
                <View style={tw`flex-row items-center justify-between`}>
                  <Text
                    style={tw`${
                      task.completed ? 'line-through text-gray-500' : 'text-black'
                    }`}
                  >
                    {task.text} ({task.priority})
                  </Text>
                  <TouchableOpacity onPress={() => toggleTask(task.id)}>
                    <Text style={tw`text-[#8B5CF6] text-lg`}>{task.completed ? '☑' : '⬜'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={tw`ml-4 mt-2`}>
                  <View style={tw`flex-row`}>
                    <TextInput
                      style={tw`flex-1 p-1 border rounded-l-lg text-black`}
                      value={newSubtask}
                      onChangeText={setNewSubtask}
                      placeholder="Adicionar subtarefa"
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                      style={tw`px-2 py-1 bg-[#60A5FA] rounded-r-lg`}
                      onPress={() => addSubtask(task.id)}
                    >
                      <Text style={tw`text-white font-semibold`}>Adicionar</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={tw`ml-4 mt-2 space-y-1`}>
                    {(subtasks[task.id] || []).map((subtask) => (
                      <View key={subtask.id} style={tw`flex-row items-center`}>
                        <TouchableOpacity onPress={() => toggleSubtask(task.id, subtask.id)}>
                          <Text style={tw`text-[#8B5CF6] text-lg`}>{subtask.completed ? '☑' : '⬜'}</Text>
                        </TouchableOpacity>
                        <Text
                          style={tw`ml-2 ${subtask.completed ? 'line-through text-gray-500' : 'text-black'}`}
                        >
                          {subtask.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Distraction Blocker */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>Bloqueador de Distrações</Text>
          <View style={tw`flex-row mb-4`}>
            <TextInput
              style={tw`flex-1 p-2 border rounded-l-lg text-black`}
              onChangeText={(text) => setBlockedApps((prev) => [...prev, addBlockedApp(text)])}
              placeholder="Adicionar app/site para bloquear"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={tw`px-4 py-2 rounded-r-lg ${isBlocked ? 'bg-red-500' : 'bg-[#60A5FA]'}`}
              onPress={toggleBlocker}
            >
              <Text style={tw`text-white font-semibold`}>{isBlocked ? 'Desativar' : 'Ativar'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={tw`text-black`}>Apps/Sites bloqueados: {blockedApps.join(', ') || 'Nenhum'}</Text>
        </View>

        {/* Mood Diary */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>Diário de Humor</Text>
          <View style={tw`flex-row mb-4`}>
            <TextInput
              style={tw`flex-1 p-2 border rounded-l-lg text-black`}
              value={mood}
              onChangeText={setMood}
              placeholder="Como você está se sentindo?"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={tw`px-4 py-2 bg-[#8B5CF6] rounded-r-lg`}
              onPress={logMood}
            >
              <Text style={tw`text-white font-semibold`}>Registrar</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`space-y-2`}>
            {moodHistory.map((entry, index) => (
              <View key={index} style={tw`p-2 bg-gray-100 rounded-lg`}>
                <Text style={tw`text-black`}>{entry.date}: {entry.mood}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Calendar Integration */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-xl font-semibold text-gray-800 mb-4`}>Integração com Calendário</Text>
          <View style={tw`flex-row mb-4`}>
            <TextInput
              style={tw`flex-1 p-2 border rounded-l-lg text-black`}
              value={newEvent}
              onChangeText={setNewEvent}
              placeholder="Adicionar evento ao calendário"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={tw`px-4 py-2 bg-[#60A5FA] rounded-r-lg`}
              onPress={addCalendarEvent}
            >
              <Text style={tw`text-white font-semibold`}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`space-y-2`}>
            {calendarEvents.map((event) => (
              <View key={event.id} style={tw`p-2 bg-gray-100 rounded-lg`}>
                <Text style={tw`text-black`}>{event.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gamification: Points and Trees */}
        <View style={tw`text-center`}>
          <Text style={tw`text-xl font-semibold text-gray-800 mb-2`}>Suas Conquistas</Text>
          <Text style={tw`text-2xl text-[#FBBF24] font-bold`}>{points} Pontos</Text>
          <Text style={tw`text-xl text-green-500 font-bold`}>{trees} Árvores</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default App;