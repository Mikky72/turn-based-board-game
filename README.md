turn-based-board-game

For Live Preview:
https://mo-othman.github.io/turn-based-board-game


Start by randomly generating the game map. Each box can be either:

-Empty

-Unavailable (dimmed)

On the map, a limited number of weapons (up to 4) will be placed randomly and can be collected by players who pass through.

The placement of the two players is also randomly on the map when the game loads.


For each turn, a player can move from one to three boxes (horizontally or vertically) before ending their turn. They obviously can not pass through obstacles directly.

If a player passes over a box containing a weapon, they leave their current weapon on site and replace it with the new one.



Each player attacks in turn

The damage depends on the player's weapon

The player can choose to attack or defend against the next shot

If the player chooses to defend themselves, they sustain 50% less damage than normal

As soon as the life points of a player (initially 100) falls to 0, they lose. A message appears and the game is over.
