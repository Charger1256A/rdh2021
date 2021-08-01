import React, { useState, useEffect } from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Switch, TextInput, KeyboardAvoidingView} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';

// stuff to do:
//  1. danger zone crossing button removes item from array not the stat
//  2. swap black and red goal and elements - Done!
//  3. reset color back to grey when all three are selected - Done!
//  element set works without toggle
//  + or - on the side of the buttons
//  live updates

export default function App() {
  const matchCollection = firestore().collection('matches');

  const [events, setEvents] = useState([]);
  const [points, setPoints] = useState(0);
  const [elementSet, setElementSet] = useState(false);
  const [items, setItems] = useState({
    yellowGoal: 0,
    redGoal: 0,
    blackGoal: 0,
    vials: 0,
    yellowElement: 0,
    redElement: 0,
    blackElement: 0,
    elementSet: elementSet,
    dangerZoneCrossing: 0,
    totalPenalties: 0,
  });
  const [dangerZoneCrossing, setDangerZoneCrossing] = useState([]);
  const [decontaminationButton, setDecontaminationtButton] = useState(false);
  const [labDoorButton, setLabDoorButton] = useState(false);
  const [chemicalSpillButton, setChemicalSpillButton] = useState(false);
  const [robot, setRobot] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([
    {label: 'Robot 1', value: '1'},
    {label: 'Robot 2', value: '2'}
  ]);
  const [match, setMatch] = useState('');


  useEffect(() => {
    if (value) {
      setCurrentMatchData();
    }
  })

  function setCurrentMatchData() {
    firestore()
      .collection('matches')
      .doc(`currentMatch`)
      .collection('robots')
      .doc(value)
      .set({ name: robot, points: points, items: items, dangerZoneCrossing: dangerZoneCrossing })
      .then(() => {
        console.log("Updated Current Match Data!");
      })
  }

  function submitMatch() {
    firestore()
      .collection('matches')
      .doc(match)
      .collection('robots')
      .doc(value)
      .set({ name: robot, points: points, items: items, dangerZoneCrossing: dangerZoneCrossing })
      .then(() => {
        console.log(`Set Match Data for ${match}`);
      })

      clear()
  }

  // function updateData(robot) {
  //   firestore()
  //     .collection
  // }

  function updateEvents(event) {
    var localEvents = events;
    localEvents.push(event);

    setEvents(localEvents);
    // console.log(events);
    updatePoints();
    updateItems();
  }

  function updatePoints() {
    var localPoints = 0;
    for (var i = 0; i < events.length; i++) {
      if (events[i] === "F") {
        localPoints -= 5;
      } else if (events[i] === "TF") {
        localPoints -= 10;
      } else if (events[i] === "YC") {
        localPoints -= 25;
      } else if (events[i] === "RC") {
        localPoints -= 50;
      } else if (events[i] === "YG") {
        localPoints += 10
      } else if (events[i] === "RG") {
        localPoints += 20
      } else if (events[i] === "BG") {
        localPoints += 15
      } else if (events[i] === "V") {
        localPoints += 5
      } else if (events[i] === "YE") {
        localPoints += 30
      } else if (events[i] === "RE") {
        localPoints += 50
      } else if (events[i] === "BE") {
        localPoints += 45
      }
      // localPoints += events[i];
    }
    localPoints += items.dangerZoneCrossing * 5;

    if (localPoints < 0) {
      localPoints = 0;
    }
    setPoints(localPoints);
  }

  function updateItems() {
    var localItems = {
      yellowGoal: 0,
      redGoal: 0,
      blackGoal: 0,
      vials: 0,
      yellowElement: 0,
      redElement: 0,
      blackElement: 0,
      elementSet: elementSet,
      dangerZoneCrossing: items.dangerZoneCrossing,
      totalPenalties: 0,
    };
    for (var i = 0; i < events.length; i++) {
      // console.log(events[i]);
      if (events[i] === "F") {
        localItems.totalPenalties -= 5;
      } else if (events[i] === "TF") {
        localItems.totalPenalties -= 10;
      } else if (events[i] === "YC") {
        localItems.totalPenalties -= 25;
      } else if (events[i] === "RC") {
        localItems.totalPenalties -= 50;
      } else if (events[i] === "YG") {
        localItems.yellowGoal++;
      } else if (events[i] === "RG") {
        localItems.redGoal++;
      } else if (events[i] === "BG") {
        localItems.blackGoal++;
      } else if (events[i] === "V") {
        localItems.vials++;
      } else if (events[i] === "YE") {
        localItems.yellowElement++;
      } else if (events[i] === "RE") {
        localItems.redElement++;
      } else if (events[i] === "BE") {
        localItems.blackElement++;
      }
    }
    // alert("test")
    setItems(localItems);
  }

  function undo() {
    var localEvents = events;
    // console.log(localEvents);
    localEvents.pop();
    // console.log(localEvents);
    setEvents(localEvents);
    updatePoints();
    updateItems();
  }

  function clear() {
    if(elementSet) {
      toggleElementSet();
    }
    setEvents([]);
    setPoints(0);
    setItems({
      yellowGoal: 0,
      redGoal: 0,
      blackGoal: 0,
      vials: 0,
      yellowElement: 0,
      redElement: 0,
      blackElement: 0,
      elementSet: elementSet,
      dangerZoneCrossing: 0,
      totalPenalties: 0,
    })
    setDangerZoneCrossing([])
    updateButtonColor();
    setMatch('');
    setRobot('');
  }

  function toggleElementSet() {
    setElementSet(!elementSet);
    updatePointsElementSet();
    var localItems = items;
    localItems.elementSet = !elementSet;
    setItems(localItems);
  }

  function updatePointsElementSet() {
    updatePoints();
    if (!elementSet) {
      setPoints(Math.round(points * 1.2));
      return;
    }
  }

  const updateDangerZoneCrossing = (barrier) => {
    var localDangerZoneCrossing = dangerZoneCrossing;
    var localItems = items
    console.log(localDangerZoneCrossing);
    console.log(`187: ${typeof(localDangerZoneCrossing)}`);
    if(localDangerZoneCrossing.includes(barrier)) {
      localDangerZoneCrossing.shift(); //Removes first item
      // alert(localDangerZoneCrossing);
    }
    localDangerZoneCrossing.push(barrier);
    localDangerZoneCrossing = [...new Set(localDangerZoneCrossing)];
    // alert(localDangerZoneCrossing);
    if(localDangerZoneCrossing.length === 3 && !hasDuplicates(localDangerZoneCrossing)) {
      // console.log("done");
      localItems.dangerZoneCrossing++;
      updatePoints();
      localDangerZoneCrossing = [];
    }


    setItems(localItems);
    // console.log(`201: ${localDangerZoneCrossing}`);
    setDangerZoneCrossing(localDangerZoneCrossing);
    // console.log(`203: ${dangerZoneCrossing}`);
    // console.log(dangerZoneCrossing);
    updateButtonColor(localDangerZoneCrossing);
  }

  function updateButtonColor(buttonData) {
    // console.log(`209: ${dangerZoneCrossing}`);
    if (!buttonData) {
      buttonData = [];
    }
    // console.log(`213: ${buttonData}`);

    setDecontaminationtButton(buttonData.includes("D"));
    setLabDoorButton(buttonData.includes("LD"));
    setChemicalSpillButton(buttonData.includes("CS"));
  }

  function removeDangerZoneCrossing() {
    var localItems = items;
    if (localItems.dangerZoneCrossing > 0) {
      localItems.dangerZoneCrossing--;
    }
    setDangerZoneCrossing([]); 
    setItems(localItems);
    updatePoints();
    updateItems();
    updateButtonColor();
  }

  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }
  return (
    <KeyboardAvoidingView behavior="position" style={styles.sectionContainer} enabled>
      <View style={styles.buttonGroup}>
        <View style={styles.column}>
          <View style={styles.sections}>
            <Text style={styles.sectionTitle}>Teleop</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.yellow]}
            onPress={() => updateEvents('YG')}>
            <Text>Yellow Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.black]}
            onPress={() => updateEvents('BG')}>
            <Text style={[styles.whiteText]}>Black Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.red]}
            onPress={() => updateEvents('RG')}>
            <Text>Red Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('V')}>
            <Text>Vials</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.yellow]}
            onPress={() => updateEvents('YE')}>
            <Text>Yellow Element</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.black]}
            onPress={() => updateEvents('BE')}>
            <Text style={[styles.whiteText]}>Black Element</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.red]}
            onPress={() => updateEvents('RE')}>
            <Text>Red Element</Text>
          </TouchableOpacity>
          <View style={styles.obstacleButtons}>
              <TouchableOpacity style={decontaminationButton ? [styles.obstacleButton, {backgroundColor: "#aec6cf"}] : styles.obstacleButton} onPress={() => updateDangerZoneCrossing("D")}><Text>Decontamination</Text></TouchableOpacity>
              <TouchableOpacity style={labDoorButton ? [styles.obstacleButton, {backgroundColor: "#aec6cf"}] : styles.obstacleButton} onPress={() => updateDangerZoneCrossing("LD")}><Text>Lab Door</Text></TouchableOpacity>
              <TouchableOpacity style={chemicalSpillButton ? [styles.obstacleButton, {backgroundColor: "#aec6cf"}] : styles.obstacleButton} onPress={() => updateDangerZoneCrossing("CS")}><Text>Chemical Spill</Text></TouchableOpacity>
          </View>
          <View style={styles.sections}>
            <Text style={styles.sectionTitle}>Management</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => undo()}>
            <Text>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => removeDangerZoneCrossing()}>
            <Text>Remove Danger Zone Crossing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => clear()}>
            <Text>Clear</Text>
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <View style={styles.switchText} >
              <Text>Element Set:</Text>
            </View>
            <View style ={styles.switchSwitch}>
              <Switch 
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={elementSet ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleElementSet}
              value={elementSet}
              />
            </View>   
          </View>
          <View style={styles.points}>
            <Text style={styles.pointText}>Points: {points}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.sections}>
            <Text style={styles.sectionTitle}>Penalties</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('F')}>
            <Text>Foul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('TF')}>
            <Text>Technical Foul</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.yellow]}
            onPress={() => updateEvents('YC')}>
            <Text>Yellow Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.red]}
            onPress={() => updateEvents('RC')}>
            <Text>Red Card</Text>
          </TouchableOpacity>
          <View style={styles.sections}>
            <Text style={styles.sectionTitle}>Match Stats</Text>
          </View>
          <View style={styles.stats}>
            <Text>Yellow Goal: {items.yellowGoal}</Text>
            <Text>Black Goal: {items.blackGoal}</Text>
            <Text>Red Goal: {items.redGoal}</Text>
            <Text>Vials: {items.vials}</Text>
            <Text>Yellow Element: {items.yellowElement}</Text>
            <Text>Black Element: {items.blackElement}</Text>
            <Text>Red Element: {items.redElement}</Text>
            <Text>Element Set: {items.elementSet ? "complete":"incomplete"}</Text>
            <Text>Danger Zone Crossing: {items.dangerZoneCrossing}</Text>
            <Text>Total Penalties: {items.totalPenalties}</Text>
            <DropDownPicker
              style={styles.picker}
              open={open}
              value={value}
              items={dropdownItems}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setDropdownItems}
            />
            <View style={[styles.buttonGroup, {marginTop: 10}]}>
              <TextInput 
                style={styles.input}
                onChangeText={setRobot}
                value={robot}
                placeholder="robot# (eg: 1)"
              />
              <TextInput 
                style={styles.input}
                onChangeText={setMatch}
                value={match}
                placeholder="match# (eg: QM3)"
              />
              <TouchableOpacity 
                style={[styles.obstacleButton, {height: 42, marginTop: 10}]}
                onPress={() => submitMatch()}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>     
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'column',
    width: '100%',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  yellow :{
    backgroundColor: '#FDFD96',
  },
  red: {
    backgroundColor: '#FF6961',
  },
  black: {
    backgroundColor: '#1D1C1A',
  },
  whiteText: {
    color: "#ffffff",
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    borderRadius: 10,
  },
  obstacleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    borderRadius: 10,
    flex: 0.3,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  column: {
    width: '50%',
  },
  sections: {
    marginTop: 10,
    marginBottom: 5,
  },
  points: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointText: {
    fontWeight: 'bold',
    backgroundColor: 'yellow',
    fontSize: 50
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 30
  },
  switchSwitch: {
    marginLeft: 10,
  },
  switchText: {
    marginTop: 6
  },
  stats: {
    padding: 10,
  },
  obstacleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomCenter: {
    position: "absolute", 
    bottom: 0, 
    right: 0
  },
  picker: {
    marginTop: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    flex: 0.7
  },
});
