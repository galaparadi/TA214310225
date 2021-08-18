// let username = $('.username-link').attr('id');
// let socket = io(`http://localhost:4000`, {
//     query: {
//         'username': username
//     },
//     auth: {
//         username
//     }
// });

// socket.on('notification', data => {
//     console.log('getting notif....')
//     pushNotif(data);
// });

let pushNotif = (data) => {
	renderNotifItem(data);
}

let submitNotif = (notifId, username) => {
	// alert(`i'm submitted by ${param}`)
	$.post(`/u/${username}/notif`, { notifId }, function (data) {
		// alert('confirm submit');
	})
}

let renderNotifItem = ({ message, workspace }) => {
	let notifItemTemplate = `<div class="card-panel">
				<div class="row" style="margin-bottom: 5px">
					<div class="col l9 s9 valign-wrapper">
						<p style="margin-top: 0px"><b><a href="/${workspace}"
									style="text-transform: uppercase;">${workspace}</a></b>
							12/12/1222
						</p>
					</div>
					<div class="col l3 s3">
						<img class="circle responsive-img right" src="https://ui-avatars.com/api/?name=galant.paradise">
					</div>
				</div>				
				<div class="row">
					<div class="col">${message}</div>
				</div>
			</div>`;


	if ($('#notif-wrapper>.card-panel').length) {
		$('#notif-wrapper>.card-panel:first').before(notifItemTemplate);
	} else {
		$('#notif-wrapper').html(notifItemTemplate);
	}
}

let changeContentItem = ({ hash, body }) => {
	if (hash.replace('#', ''))
		$.post(`/x/${hash.replace('#', '')}`, body, (data, status) => $('.container').html(data));
}

changeContentItem({ hash: location.hash });
$(window).on('hashchange', e => changeContentItem({ hash: location.hash }));