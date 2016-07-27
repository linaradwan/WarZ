var target : GameObject;
var fadeDuration : float = 3.0;


function Update(){
	
    if (target.GetComponent.<Renderer>().material.color.a > 0)
    target.GetComponent.<Renderer>().material.color.a -= Time.deltaTime/fadeDuration;
}
