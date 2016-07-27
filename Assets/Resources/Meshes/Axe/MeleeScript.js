
	//ANIMATION OF YOUR WEAPONS
	var weaponAnim : GameObject;         
	var idleAnim : String = "Idle";

	var meleeAttackRange : float = 3.0;       		 //how far you can hit someone or something (i suggest to use from 1 to 3).
	var meleeDamage : float = 300.0;             	 //how much damage will receive enemy.
	var meleeSlash : AudioClip;                    	 
	var meleeHitUntagged : GameObject;       	
	var meleeHitEnemy : GameObject;
	private var inAttack : boolean = false;
	
	//MELEE ANIMATIONS
	var axeHit : String = "HitAnim";                   	
	var DrawAnimation : String = "DrawAXE";
	var soundDraw : AudioClip;
	var soundAxeSlash : AudioClip;
	
	//CROSSHAIR
	var crosshair : Texture2D;                   
	
	//GUI
	var mySkin : GUISkin;                         
	
	var force : float = 400;
	var selected : boolean = false;
	var layerMask : LayerMask;
	
function Start (){
	weaponAnim.GetComponent.<Animation>().wrapMode = WrapMode.Loop;
	weaponAnim.GetComponent.<Animation>()[axeHit].wrapMode = WrapMode.Once;
	weaponAnim.GetComponent.<Animation>()[axeHit].layer = 1;
    inAttack = false;	
}
    
function Update (){
    if(selected){

		if (Input.GetButtonDown("Fire")){                    
			MeleeAttack();            
		}
		
		if(!inAttack){
			weaponAnim.GetComponent.<Animation>().CrossFade(idleAnim);
		}
	}
}

function OnGUI(){

		if(crosshair != null){	
			var w = crosshair.width/2;
			var h = crosshair.height/2;
			position = Rect((Screen.width - w)/2,(Screen.height - h )/2, w, h);	
			GUI.DrawTexture(position, crosshair);
		}

}

function MeleeAttack(){
	if(inAttack)
    return;
	inAttack = true;
    if(axeHit != ""){
		weaponAnim.GetComponent.<Animation>()[axeHit].speed = weaponAnim.GetComponent.<Animation>()[axeHit].clip.length/1.0;
		weaponAnim.GetComponent.<Animation>().Play(axeHit);
	}
	yield WaitForSeconds (0.3);
	GetComponent.<AudioSource>().clip = soundAxeSlash;
	GetComponent.<AudioSource>().Play();
	yield WaitForSeconds (0.2);
	MeleeAttackHit();	
}
	

function MeleeAttackHit(){
    var direction = transform.TransformDirection(0, 0, 1);
    var hit : RaycastHit;
	
	if(Physics.Raycast (transform.position, direction, hit, 1000.0 , layerMask.value)){ 
		var contact = hit.point;
	    var rotation = Quaternion.FromToRotation(Vector3.up, hit.normal);
		
        if (hit.distance < meleeAttackRange){

		    if (hit.rigidbody){
		        hit.rigidbody.AddForceAtPosition(force * direction, hit.point);
	        }
		
		    if (hit.transform.tag == "Untagged" || hit.transform.tag == "Concrete" || hit.transform.tag == "Dirt" || hit.transform.tag == "Wood" || hit.transform.tag == "Metal"){
				var default1 = Instantiate (meleeHitUntagged, contact, rotation) as GameObject;
			    default1.transform.position = hit.point;
				default1.transform.localPosition += .02*hit.normal;
			    GetComponent.<AudioSource>().clip = meleeSlash;
	            GetComponent.<AudioSource>().Play();
		    }
			
			if (hit.transform.tag == "Enemy") {
				Instantiate (meleeHitEnemy, contact, rotation);
			}
			
		    hit.collider.SendMessageUpwards("ApplyDamage", meleeDamage, SendMessageOptions.DontRequireReceiver);
	    } 
	}
	yield WaitForSeconds (.5);
	inAttack = false;
}

function DrawWeapon(){
	draw = true;
	GetComponent.<AudioSource>().clip = soundDraw;
	GetComponent.<AudioSource>().Play();
	weaponAnim.GetComponent.<Animation>()[DrawAnimation].speed = weaponAnim.GetComponent.<Animation>()[DrawAnimation].clip.length/0.9;
	weaponAnim.GetComponent.<Animation>().Play(DrawAnimation);
	yield WaitForSeconds(0.6);

	selected = true;
}

function Deselect(){
	selected = false;
}


