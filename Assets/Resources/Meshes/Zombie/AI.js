var target : Transform; //the enemy's target
var moveSpeed = 3; //move speed
var rotationSpeed = 3; //speed of turning
var attackRange = 3; // distance within which to attack
var chaseRange = 10; // distance within which to start chasing
var giveUpRange = 20; // distance beyond which AI gives up
var attackRepeatTime : float = 1.5; // delay between attacks when within range
var anim : GameObject;
var maximumHitPoints = 5.0;
var hitPoints = 5.0;
var attack : AudioClip;
private var chasing = false;
private var attackTime : float;
var checkRay : boolean = false;
var idleAnim : String = "idle";
var walkAnim : String = "walk";
var attackAnim : String = "attack"; 
var dontComeCloserRange : int = 4;

private var myTransform : Transform; //current transform data of this enemy

function Awake(){
    myTransform = transform; //cache transform data for easy access/preformance
	anim.GetComponent.<Animation>().wrapMode = WrapMode.Loop;
	anim.GetComponent.<Animation>()[attackAnim].wrapMode = WrapMode.Once;
	anim.GetComponent.<Animation>()[attackAnim].layer = 2;
	anim.GetComponent.<Animation>().Stop();
}

function Start(){
	target = GameObject.FindWithTag("Player").transform;
}

function Update () {
    // check distance to target every frame:
	var distance = (target.position - myTransform.position).magnitude;
	
	if (distance < dontComeCloserRange){
			moveSpeed = 0;
			
			anim.GetComponent.<Animation>()[idleAnim].speed = .4;
			anim.GetComponent.<Animation>().CrossFade(idleAnim);
		}else{
			moveSpeed = Random.Range(4, 6);
			anim.GetComponent.<Animation>().CrossFade(walkAnim);
		}
	
	if (chasing) {	
		//move towards the player
		myTransform.position += myTransform.forward * moveSpeed * Time.deltaTime;
		

        //rotate to look at the player
        myTransform.rotation = Quaternion.Slerp(myTransform.rotation, Quaternion.LookRotation(target.position - myTransform.position), rotationSpeed*Time.deltaTime);
		transform.eulerAngles = Vector3(0, transform.eulerAngles.y, 0); 

        // give up, if too far away from target:
        if (distance > giveUpRange) {
            chasing = false;
        }

        // attack, if close enough, and if time is OK:
        if (distance < attackRange && Time.time > attackTime) {
			anim.GetComponent.<Animation>()[attackAnim].speed = 2.0;
            anim.GetComponent.<Animation>().CrossFade(attackAnim);
            target.SendMessage( "PlayerDamage", maximumHitPoints);
            attackTime = Time.time + attackRepeatTime;
			GetComponent.<AudioSource>().PlayOneShot(attack, 1.0 / GetComponent.<AudioSource>().volume);
        }

    } else {
        // not currently chasing.
		anim.GetComponent.<Animation>()[idleAnim].speed = .4;
		anim.GetComponent.<Animation>().CrossFade(idleAnim);
        // start chasing if target comes close enough
        if (distance < chaseRange) {
            chasing = true;
        }
    }
}


function OnDrawGizmosSelected (){
	Gizmos.color = Color.yellow;
	Gizmos.DrawWireSphere (transform.position, attackRange);
	Gizmos.color = Color.red;
	Gizmos.DrawWireSphere (transform.position, chaseRange);
}
