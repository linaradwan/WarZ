var rocketGUI : GUIText;
var projectile : Rigidbody;
var initialSpeed = 30.0;
var reloadTime = 0.5;
var ammoCount = 20;
private var lastShot = -10.0;
var launchPosition : GameObject;
var animGL : GameObject;
var rocket : GameObject;
var soundFire : AudioClip;
var soundDraw : AudioClip;
var waitTime : float = 3; //for rocket render



function Start () {
animGL.GetComponent.<Animation>().Play ("Draw");
GetComponent.<AudioSource>().clip = soundDraw;
GetComponent.<AudioSource>().Play();
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
	if (Time.time > reloadTime + lastShot && ammoCount > 0){
		// create a new projectile, use the same position and rotation as the Launcher.
		var instantiatedProjectile : Rigidbody = Instantiate (projectile, launchPosition.transform.position, launchPosition.transform.rotation);
		turnOffRender();
		animGL.GetComponent.<Animation>().Play("FireRL");	
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


function turnOffRender(){
	rocket.GetComponent.<Renderer>().enabled = false;
	yield WaitForSeconds (waitTime);
	rocket.GetComponent.<Renderer>().enabled = true;
}

function Gui () {
    rocketGUI.text ="Rockets:   " + ammoCount.ToString();
}
