https://www.codewars.com/kata/robby-the-robot/train/javascript

Robby, the robot, wants to find his way back home. Unfortunately his power is pretty low, so he needs to find the shortest way from his Start point (S) to the Target cell (T).

When Robby starts, he always looks into north direction. He has a limited command set and each command costs him 1 unit of power. The commands are:

```javascript
Commands = {
  "TURN_RIGHT": "r", // turn right by 90°
  "TURN_LEFT": "l", // turn left by 90°
  "MOVE_FORWARDS": "f" // move one field forwards into current direction
};
```
The field, Robby is moving on, is defined by a string, which may have different dimensions, but is always squared.

Example for a 3x3 field:

```javascript
field = 'S.......T';
// which means:
field =
  'S..' +
  '...' +
  '..T';
```
Each cell of the field is described by a character:

```javascript
Fields = {
  "WALKABLE": ".", // Robby may walk on this
  "BLOCKED": "#", // Robby must not walk on this
  "START": "S", // Robby is starting here, he may also walk here
  "TARGET": "T" // The target cell, Robby has to reach
};
```
Your task is to write a function, which returns the list of commands, Robby has to do in order to reach the target cell and save as much power as possible. If Robby is not able to reach the target with the remaining power, the function should return an empty list.

Example:

```javascript
getCommands('T.S.', 5); // -> ['f'], because he just has to move forward
getCommands('S.......T', 10); // -> ['r', 'f', 'f', 'r', 'f', 'f']
getCommands('S.......T', 5); // -> [], because he needs at least 6 units of power
getCommands('S#.##...T', 20); // => [], because the target can not be reached (with an arbitrary amount of power)
```
Additional notes:

There is exactly one Start point (S)
There is exactly one Target point (T)
Each test case has exactly one solution (= only one shortest command list)

```javascript
// test fixtures from description
Test.expect(getCommands('T.S.', 10).join('') == 'f');
Test.expect(getCommands('S.......T', 10).join('') == 'rffrff');
Test.expect(getCommands('S.......T', 5).join('') == '');
Test.expect(getCommands('S#.##...T', 20).join('') == '');
```