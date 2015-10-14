Tablut: README

Tablut was a chess-like strategy game played by the Vikings and other ancient peoples of northern Europe. I was recently introduced to the game and thought it would be a good first project and an opportunity to get my hands dirty with some serious back-end coding.

Initially the game used only text. Information on the board position was stored in the DOM itself and retrieved using jQuery. This soon proved to be unwieldy and I replaced it with a JS array representing the board. The switchover was complicated and threw up multiple bugs (now all fixed, as far as I can tell). Detecting captures was particularly challenging because of the way they work in Tablut: the computer must examine up to eight squares after each move.

In future updates I'd like to improve the animation, add sound and provide the user with options to customize the appearance and gameplay. Ultimately I would like to implement an AI to play against the user, but given the complexity of Tablut, that would be a major project.