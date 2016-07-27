/**
*  Script written by OMA [www.armedunity.com]
**/

var lift : GameObject;
var liftSound : AudioClip;  
private var canUse : boolean = false;
var waitTime : float; //Time to Open door (animation lenght)
private var IRuzspiests : boolean = false;


function Down () {
	lift.GetComponent.<Animation>().CrossFade("LiftDown");
	GetComponent.<AudioSource>().PlayOneShot(liftSound, 1.0 / GetComponent.<AudioSource>().volume);
}

function Up (){
	lift.GetComponent.<Animation>().CrossFade("LiftUp");
	GetComponent.<AudioSource>().PlayOneShot(liftSound, 1.0 / GetComponent.<AudioSource>().volume);
}

function ApplyDamage(){
	Action ();
}

function Action (){
    if (!canUse && !IRuzspiests){
		Up();
		canUse = true;
		IRuzspiests = true;
		yield WaitForSeconds(waitTime);
		IRuzspiests = false;
	
	}else{
		if (canUse && !IRuzspiests){
		Down();
		canUse = false;
		IRuzspiests = true;
		yield WaitForSeconds(waitTime);
		IRuzspiests = false;
		}
	}
}