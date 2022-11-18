window.addEventListener('load', game);

function game() {
    const PLAYER_X = 'playerX'
    const PLAYER_O = 'playerO'
    const WINNING_LINES = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [1, 4, 7],
        [0, 3, 6],
        [2, 5, 8],
        [2, 4, 6],
        [0, 4, 8]
    ];
    let playerOTurn = false
    let currentPlayer = 'X'
    let index = 0

    const cellsContainer = document.querySelector('.container')
    const announcer = document.querySelector('.announcer')
    const resetButton = document.getElementById('reset')
    const displayPlayer = document.querySelector('.display-player')
    const avatars = Array.from(document.querySelectorAll('.avatar-icon'))
    const placesTo = Array.from(document.querySelectorAll('.avatar-container'))

    for (let i = 1; i < 10; i++) {
        cellsContainer.insertAdjacentHTML('beforeend', '<div class="tile"></div>')
    }

    const tileElements = document.querySelectorAll('.tile')

    cellsContainer.addEventListener('click', handleClick)
    resetButton.addEventListener('click', restartGame)

    function handleClick(e) {
        let tile = e.target
        const isArrowControl = tile === document
        if (isArrowControl) {
            tile = tileElements[index]
        }
        const currentClass = playerOTurn ? PLAYER_O : PLAYER_X
        placeMark(tile, currentClass)
        if (checkWin(currentClass)) {
            endGame(false)
            cellsContainer.removeEventListener('click', handleClick)
            document.removeEventListener('enter', handleClick)
        } else if (isDraw()) {
            endGame(true)
            cellsContainer.removeEventListener('click', handleClick)
            document.removeEventListener('enter', handleClick)
        } else {
            changePlayer()
        }
    }

    function placeMark(tile, currentClass) {
        tile.classList.add(currentClass)
        if (currentClass === 'playerX') {
            tile.innerText = 'X'
        }
        if (currentClass === 'playerO') {
            tile.innerText = 'O'
        }
    }

    function changePlayer() {
        playerOTurn = !playerOTurn
        displayPlayer.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        displayPlayer.innerText = currentPlayer;
        displayPlayer.classList.add(`player${currentPlayer}`);
    }

    function checkWin(currentClass) {
        return WINNING_LINES.some(combination => {
            return combination.every(index => {
                return tileElements[index].classList.contains(currentClass)
            })
        })
    }

    function endGame(tie) {
        if (tie) {
            announcer.innerText = 'TIE!'
            announcer.classList.remove('hide')
        } else {
            announcer.innerHTML = `
            ${playerOTurn ?
                'Player <span class="playerO">O Won</span>'
                : 'Player <span class="playerX">X Won</span>'}`
            announcer.classList.remove('hide')
        }
    }

    function isDraw() {
        return [...tileElements].every(tile => {
            return tile.classList.contains(PLAYER_X) || tile.classList.contains(PLAYER_O)
        })
    }

    function restartGame() {
        location.reload()
    }


    avatars.forEach(avatar => {
        avatar.setAttribute('draggable', 'true')
    })

    placesTo.forEach(place => {
        place.ondragover = allowDrop
        place.addEventListener('drop', drop)
    })

    function allowDrop(e) {
        e.preventDefault()
    }

    avatars.forEach(avatar => {
        avatar.addEventListener('dragstart', drag)
    })

    function drag(e) {
        avatars.forEach(avatar => {
            const itemId = avatar.getAttribute('data-item')
            avatar.setAttribute('id', itemId)
            e.dataTransfer.setData('id', e.target.id)
        })
    }

    function drop(e) {
        let itemId = e.dataTransfer.getData('id')
        e.target.append(document.getElementById(itemId))
        if (placesTo[0].innerHTML !== '' && placesTo[1].innerHTML !== '') {
            avatars.forEach(avatar => {
                avatar.removeEventListener('dragstart', drag)
            })
        }
    }

    const customEvent = new CustomEvent('enter')

    document.addEventListener('enter', handleClick)

    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            document.dispatchEvent(customEvent)
        }
    })

    document.addEventListener('keydown', arrowControl)

    function arrowControl(event) {
        if (index >= 0 && index < 9) {
            tileElements[index].focus()
            tileElements[index].setAttribute('style', 'background-color: grey')
            if (event.code !== 'ArrowRight' && event.code !== 'ArrowLeft') {
                return
            }
            if (event.code === 'ArrowRight') {
                index += 1
                tileElements[index - 1].removeAttribute('style')
                tileElements[index].setAttribute('style', 'background-color: grey')
            } else if (event.code === 'ArrowLeft') {
                index -= 1
                tileElements[index + 1].removeAttribute('style')
                tileElements[index].setAttribute('style', 'background-color: grey')
            }
        }
    }
}
