var anim : String = "DrawUnsil";

function Update () {
if(!Input.GetButton("Fire2")){
//animation.Play("BreathSimple");
//animation.CrossFadeQueued(anim, 0.3, QueueMode.PlayNow);
GetComponent.<Animation>().Play(anim);
}else{
GetComponent.<Animation>().CrossFade("IdleBreath");
}
}
