import helpers from './helpers.js';
window.addEventListener("DOMContentLoaded",() => {
	const clock = new BouncyEmbossedClock(".clock");
});

class BouncyEmbossedClock {
	constructor(el) {
		this.el = document.querySelector(el);
		this.els = this.el ? this.el.querySelectorAll(".clock__digit") : [];
		this.digits = [];
		this.to = null;
		this.dto = [
			[null,null,null],
			[null,null,null],
			[null,null],
			[null,null,null],
			[null,null,null],
			[null,null],
			[null,null,null],
			[null,null,null],
		];
		this.staticUpdate();
		this.update();
	}
	getTime() {
		const time = new Date();
		const hms = [
			time.getHours(),
			time.getMinutes(),
			time.getSeconds()
		];

		return hms.map(u => u < 10 ? `0${u}` : `${u}`).join(":").split("");	
	}
	staticUpdate() {
		if (this.els) {
			this.digits = this.getTime();
			this.digits.forEach((d,i) => {
				this.els[i].textContent = d;
			});
		}
	}
	update() {
		if (this.els) {
			// get the time
			const display = this.getTime();
			const bounce = "clock__digit--bounce";
			const baseDelay = 350;
			const delayDec = 50;

			// display the digits
			display.forEach((d,i) => {
				if (+d > +this.digits[i] || +d === 0 && +this.digits[i] !== 0) {
					const colonElCL = display[i + 1] === ":" ? this.els[i + 1].classList : null;
					const el = this.els[i];
					const timeout = baseDelay - delayDec * i;

					this.dto[i].forEach(t => {
						clearTimeout(t);
					});

					// run the animation
					this.dto[i][0] = setTimeout(() => {
						el.classList.add(bounce);
					}, timeout);

					// show the next digit
					this.dto[i][1] = setTimeout(() => {
						el.textContent = d;
					}, timeout + 167);

					// kill the animation
					this.dto[i][2] = setTimeout(() => {
						el.classList.remove(bounce);
					}, timeout + 500);

					// colon animation (if applicable)
					if (colonElCL) {
						this.dto[i + 1].forEach(t => {
							clearTimeout(t);
						});

						this.dto[i + 1][0] = setTimeout(() => {
							 colonElCL.add(bounce);
						}, timeout - delayDec);

						this.dto[i + 1][1] = setTimeout(() => {
							 colonElCL.remove(bounce);
						}, (timeout - delayDec) + 500);
					}
				}

				this.digits[i] = d;
			});

			// loop
			clearTimeout(this.to);
			this.to = setTimeout(this.update.bind(this),1e3);
		}
	}
}
window.addEventListener('load', ()=>{
    //When the chat icon is clicked
    document.querySelector('#toggle-chat-pane').addEventListener('click', (e)=>{
        document.querySelector('#chat-pane').classList.toggle('chat-opened');

        //remove the 'New' badge on chat icon (if any) once chat is opened.
        setTimeout(()=>{
            if(document.querySelector('#chat-pane').classList.contains('chat-opened')){
                helpers.toggleChatNotificationBadge();
            }
        }, 300);
    });


    //When the video frame is clicked. This will enable picture-in-picture
    document.getElementById('local').addEventListener('click', ()=>{
        if (!document.pictureInPictureElement) {
            document.getElementById('local').requestPictureInPicture()
            .catch(error => {
                // Video failed to enter Picture-in-Picture mode.
                console.error(error);
            });
        } 
          
        else {
            document.exitPictureInPicture()
            .catch(error => {
                // Video failed to leave Picture-in-Picture mode.
                console.error(error);
            });
        }
    });


    //When the 'Create room" is button is clicked
    document.getElementById('create-room').addEventListener('click', (e)=>{
        e.preventDefault();

        let roomName = document.querySelector('#room-name').value;
        let yourName = document.querySelector('#your-name').value;

        if(roomName && yourName){
            //remove error message, if any
            document.querySelector('#err-msg').innerHTML = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem('username', yourName);

            //create room link
            let roomLink = `${location.origin}?room=${roomName.trim().replace(' ', '_')}_${helpers.generateRandomString()}`;

            //show message with link to room
            document.querySelector('#room-created').innerHTML = `Room successfully created. Click <a href='${roomLink}'>here</a> to enter room. 
                Share the room link with your partners.`;

            //empty the values
            document.querySelector('#room-name').value = '';
            document.querySelector('#your-name').value = '';
        }

        else{
            document.querySelector('#err-msg').innerHTML = "All fields are required";
        }
    });


    //When the 'Enter room' button is clicked.
    document.getElementById('enter-room').addEventListener('click', (e)=>{
        e.preventDefault();

        let name = document.querySelector('#username').value;

        if(name){
            //remove error message, if any
            document.querySelector('#err-msg-username').innerHTML = "";

            //save the user's name in sessionStorage
            sessionStorage.setItem('username', name);

            //reload room
            location.reload();
        }

        else{
            document.querySelector('#err-msg-username').innerHTML = "Please input your name";
        }
    });
})