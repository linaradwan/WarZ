var sound : AudioClip[];

function OnCollisionEnter (collision : Collision) {
plauDropSound();
}

function plauDropSound (){
GetComponent.<AudioSource>().clip = sound[Random.Range(0, sound.length)];
GetComponent.<AudioSource>().volume = .7;
GetComponent.<AudioSource>().Play();
}