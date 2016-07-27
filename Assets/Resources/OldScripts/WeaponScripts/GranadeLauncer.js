var grenadeGUI : GUIText;
var projectile : Rigidbody;
var initialSpeed = 30.0;
var reloadTime = 0.5;
var ammoCount = 20;
private var lastShot = -10.0;
var launchPosition : GameObject;
var animGL : GameObject;
var soundFire : AudioClip;


function Awake (){
Gui();
}

function Update () {
    if (Input.GetButtonDown("Drop")){
		BroadcastMessage("DropWeapon");
	}
	
	if (Input.GetButton("Fire1")){
		Fire();
	}
}

function Fire () {
	// Did the time exceed the reload time?
	if (Time.time > reloadTime + lastShot && ammoCount > 0) {
		// create a new projectile, use the same position and rotation as the Launcher.
		var instantiatedProjectile : Rigidbody = Instantiate (projectile, launchPosition.transform.position, launchPosition.transform.rotation);
		animGL.GetComponent.<Animation>().Play("FireGL");	
		GetComponent.<AudioSource>().clip = soundFire;
		GetComponent.<AudioSource>().Play();
		// Give it an initial forward velocity. The direction is along the z-axis of the missile launcher's transform.
		instantiatedProjectile.velocity = transform.TransformDirection(Vector3 (0, 0, initialSpeed));

		// Ignore collisions between the missile and the character controller
		Physics.IgnoreCollision(instantiatedProjectile.GetComponent.<Collider>(), transform.root.GetComponent.<Collider>());
		
		lastShot = Time.time;
		ammoCount--;
		Gui();
	}
}


function Gui () {
    grenadeGUI.text ="Grenade:  " + ammoCount.ToString();
}