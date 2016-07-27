/**
* Script made by OMA [www.armedunity.com]
**/

var concrete : AudioClip[];
var wood : AudioClip[];
var dirt : AudioClip[];
var metal : AudioClip[];
private var step : boolean = true;
var audioStepLengthWalk : float = 0.45;
var audioStepLengthRun : float = 0.25;
var walkSpeed : float = 8.0;
var runSpeed : float = 12.0;


function OnCollisionStay (col : Collision) {
var controller : RigidController = GetComponent(RigidController);

	if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (walkSpeed-2) && GetComponent.<Rigidbody>().velocity.magnitude < (walkSpeed+2) && col.gameObject.tag == "Concrete" && step == true || controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude < (walkSpeed+2) && GetComponent.<Rigidbody>().velocity.magnitude > (walkSpeed-2) && col.gameObject.tag == "Untagged" && step == true ) {
		WalkOnConcrete();
	}else if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (runSpeed-2) && col.gameObject.tag == "Concrete" && step == true || controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (runSpeed-2) && col.gameObject.tag == "Untagged" && step == true ) {
		RunOnConcrete();
	}else if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (walkSpeed-2) && GetComponent.<Rigidbody>().velocity.magnitude < (walkSpeed+2) && col.gameObject.tag == "Wood" && step == true) {
		WalkOnWood();
	}else if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (runSpeed-2) && col.gameObject.tag == "Wood" && step == true){
		RunOnWood();
	}else if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (walkSpeed-2) && GetComponent.<Rigidbody>().velocity.magnitude < (walkSpeed+2) && col.gameObject.tag == "Dirt" && step == true) {
		WalkOnDirt();
	}else if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (runSpeed-2) && col.gameObject.tag == "Dirt" && step == true){
		RunOnDirt();
	}else if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (walkSpeed-2) && GetComponent.<Rigidbody>().velocity.magnitude < (walkSpeed+2) && col.gameObject.tag == "Metal" && step == true) {
		WalkOnMetal();
	}else if (controller.grounded && GetComponent.<Rigidbody>().velocity.magnitude > (runSpeed-2) && col.gameObject.tag == "Metal" && step == true){
		RunOnMetal();
	}		
}

/////////////////////////////////// CONCRETE ////////////////////////////////////////
function WalkOnConcrete() {
	step = false;
	GetComponent.<AudioSource>().clip = concrete[Random.Range(0, concrete.length)];
	GetComponent.<AudioSource>().volume = .1;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnConcrete() {
	step = false;
	GetComponent.<AudioSource>().clip = concrete[Random.Range(0, concrete.length)];
	GetComponent.<AudioSource>().volume = .3;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}	


////////////////////////////////// WOOD /////////////////////////////////////////////
function WalkOnWood() {
	step = false;
	GetComponent.<AudioSource>().clip = wood[Random.Range(0, wood.length)];
	GetComponent.<AudioSource>().volume = .1;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnWood() {
	step = false;
	GetComponent.<AudioSource>().clip = wood[Random.Range(0, wood.length)];
	GetComponent.<AudioSource>().volume = .3;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}


/////////////////////////////////// DIRT //////////////////////////////////////////////
function WalkOnDirt() {
	step = false;
	GetComponent.<AudioSource>().clip = dirt[Random.Range(0, dirt.length)];
	GetComponent.<AudioSource>().volume = .1;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnDirt() {
	step = false;
	GetComponent.<AudioSource>().clip = dirt[Random.Range(0, dirt.length)];
	GetComponent.<AudioSource>().volume = .3;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}


////////////////////////////////// METAL ///////////////////////////////////////////////
function WalkOnMetal() {	
	step = false;
	GetComponent.<AudioSource>().clip = metal[Random.Range(0, metal.length)];
	GetComponent.<AudioSource>().volume = .1;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnMetal() {
	step = false;
	GetComponent.<AudioSource>().clip = metal[Random.Range(0, metal.length)];
	GetComponent.<AudioSource>().volume = .3;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}

@script RequireComponent(AudioSource)