var bulletSounds : AudioClip[];
var audioRicochetteLength = 0.2;
function Start () {
	PlaySounds();
}

function PlaySounds () {
	GetComponent.<AudioSource>().clip = bulletSounds[Random.Range(0, bulletSounds.length)];
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds(10);
	//yield WaitForSeconds(audio.clip.length);
	Destroy(gameObject);
}