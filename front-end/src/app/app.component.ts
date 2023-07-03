import { Component, OnInit, OnDestroy } from '@angular/core';
import {SocketService} from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
	public messages: Array<any>;
	public chatBox: string;

	public constructor(private socket: SocketService) {
		this.messages = [];
		this.chatBox = "";
	}

	public ngOnInit(): void {
		this.socket.getEventListener().subscribe(event => {
			if(event.type == "messages") {
				let data = event.data.content;
				if(event.data.sender) {
					data = event.data.sender + ":" + data;
				}
				this.messages.push(data)
				console.log('Received message:', data)
			}
			if (event.type == 'close') {
				this.messages.push("/The socket connection has been closed");
				console.log('close message')
			}
			if (event.type == 'open') {
				this.messages.push("/The socket connection has been established");
				console.log('open message')

			}
		});
	}

	public ngOnDestroy(): void {
		this.socket.close();
	}

	public send() {
		if (this.chatBox) {
			this.socket.send(this.chatBox);
			this.chatBox = "";
		}
	}

	public isSystemMessage(message: string) {
		return message.startsWith("/") ? "<strong>" + message.substring(1) + "</strong>" : message;
	}
}
