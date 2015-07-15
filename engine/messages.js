Game.Messages = {
	queue: [],
	getLatest: function() { //FIXME - temporary placeholder solution
		
		var queueLength = this.queue.length;
		var latestMessage = 'The air is cool';
		if (queueLength > 0) {
			latestMessage = this.queue[queueLength - 1];
		}
		this.queue = [];
		return [latestMessage];
	}
}

/*
Message types and properties:

type: 'attacked',
sender: this,
attacker: attacker,
damage: damage

type: 'death',
sender: this,
attacker: attacker			

type: 'attacking',
sender: this,
target: target,
damage: damage

*/