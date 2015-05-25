var $$ProjectData = {
	action: {
		// host: "http://" + window.location.host + "/TreeholeModerator"
		host: "http://192.168.0.36:8084/TreeholeModerator",
		findSchoolModeratorMessage: "/other/findSchoolModeratorMessage.action",
		findSchoolByName: "/Tree/School/findSchoolByName.action",
		preShareWx: "/open/club/getJSConfig.action", //准备分享到微信
		get: function(type) {
			return this.host + this[type];
		}
	}
};


