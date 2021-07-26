import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Switch} from 'react-native';

export default function App() {
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

  function updateEvents(event) {
    var localEvents = events;
    if (event === 'F') {
      localEvents.push(-5);
    } else if (event === 'TF') {
      localEvents.push(-10);
    } else if (event === 'YC') {
      localEvents.push(-50);
    } else if (event === 'RC') {
      localEvents.push('DISQUALIFICATION');
    } else if (event === 'YG') {
      localEvents.push(2);
    } else if (event === 'RG') {
      localEvents.push(6);
    } else if (event === 'BG') {
      localEvents.push(4);
    } else if (event === 'V') {
      localEvents.push(5);
    } else if (event === 'YE') {
      localEvents.push(10);
    } else if (event === 'RE') {
      localEvents.push(20);
    } else if (event === 'BE') {
      localEvents.push(15);
    }

    setEvents(localEvents);
    // console.log(events);
    updatePoints();
    updateItems();
  }

  function updatePoints() {
    if (events.includes('DISQUALIFICATION')) {
      setPoints('DISQUALIFICATION');
      return;
    }

    var localPoints = 0;
    for (var i = 0; i < events.length; i++) {
      localPoints += events[i];
    }
    localPoints += items.dangerZoneCrossing * 10;

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
      if (events[i] === -5) {
        localItems.totalPenalties -= 5;
      } else if (events[i] === -10) {
        localItems.totalPenalties -= 10;
      } else if (events[i] === -50) {
        localItems.totalPenalties -= 50;
      } else if (events[i] === 2) {
        localItems.yellowGoal++;
      } else if (events[i] === 6) {
        localItems.redGoal++;
      } else if (events[i] === 4) {
        localItems.blackGoal++;
      } else if (events[i] === 5) {
        localItems.vials++;
      } else if (events[i] === 10) {
        localItems.yellowElement++;
      } else if (events[i] === 20) {
        localItems.redElement++;
      } else if (events[i] === 15) {
        localItems.blackElement++;
      }
    }
    // alert("test")
    setItems(localItems);
  }

  function undo() {
    var localEvents = events;
    console.log(localEvents);
    localEvents.pop();
    console.log(localEvents);
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

  function updateDangerZoneCrossing(barrier) {
    var localDangerZoneCrossing = dangerZoneCrossing;
    var localItems = items
    if(localDangerZoneCrossing.includes(barrier)) {
      localDangerZoneCrossing.shift(); //Removes first item
      // alert(localDangerZoneCrossing);
    }
    localDangerZoneCrossing.push(barrier);
    alert(localDangerZoneCrossing);
    if(localDangerZoneCrossing.length === 3 && !hasDuplicates(localDangerZoneCrossing)) {
      localItems.dangerZoneCrossing++;
      updatePoints();
      localDangerZoneCrossing = []
    }


    setItems(localItems);
    setDangerZoneCrossing(localDangerZoneCrossing)
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
  }

  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.buttonGroup}>
        <View style={styles.column}>
          <View style={styles.sections}>
            <Text style={styles.sectionTitle}>Teleop</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('YG')}>
            <Text>Yellow Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('RG')}>
            <Text>Red Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('BG')}>
            <Text>Black Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('V')}>
            <Text>Vials</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('YE')}>
            <Text>Yellow Element</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('RE')}>
            <Text>Red Element</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('BE')}>
            <Text>Black Element</Text>
          </TouchableOpacity>
          <View style={styles.obstacleButtons}>
            <TouchableOpacity style={styles.obstacleButton} onPress={() => updateDangerZoneCrossing("D")}><Text>Decontamination</Text></TouchableOpacity>
            <TouchableOpacity style={styles.obstacleButton} onPress={() => updateDangerZoneCrossing("LD")}><Text>Lab Door</Text></TouchableOpacity>
            <TouchableOpacity style={styles.obstacleButton} onPress={() => updateDangerZoneCrossing("CS")}><Text>Chemical Spill</Text></TouchableOpacity>
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
            style={styles.button}
            onPress={() => updateEvents('YC')}>
            <Text>Yellow Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateEvents('RC')}>
            <Text>Red Card</Text>
          </TouchableOpacity>
          <View style={styles.sections}>
            <Text style={styles.sectionTitle}>Match Stats</Text>
          </View>
          <View style={styles.stats}>
            <Text>Yellow Goal: {items.yellowGoal}</Text>
            <Text>Red Goal: {items.redGoal}</Text>
            <Text>Black Goal: {items.blackGoal}</Text>
            <Text>Vials: {items.vials}</Text>
            <Text>Yellow Element: {items.yellowElement}</Text>
            <Text>Red Element: {items.redElement}</Text>
            <Text>Black Element: {items.blackElement}</Text>
            <Text>Element Set: {items.elementSet ? "complete":"incomplete"}</Text>
            <Text>Danger Zone Crossing: {items.dangerZoneCrossing}</Text>
            <Text>Total Penalties: {items.totalPenalties}</Text>
          </View>
        </View>
      </View>     
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flexDirection: 'column',
    width: '100%',
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
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  obstacleButton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    flex: 0.3
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
  }
});
