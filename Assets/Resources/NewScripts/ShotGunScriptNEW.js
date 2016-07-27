
/**
*  Script written by OMA [www.armedunity.com]
**/

//@script ExecuteInEditMode()

	var soundDraw : AudioClip;
	var soundFire : AudioClip;
	var soundReload : AudioClip;
	var soundGO : GameObject;
	var soundEmpty : AudioClip;

	var weaponAnim : GameObject;
	var Concrete : GameObject;
	var Wood : GameObject;
	var Metal : GameObject;
	var Dirt : GameObject;
	var Blood : GameObject;
	var untagged : GameObject;

	var layerMask : LayerMask;
	var muzzleFlash : Renderer;
	var muzzleLight : Light;
	var pelletsPerShot : int = 10;

	var damage : int = 50;
	var bulletsPerMag : int = 50;
	var magazines : int = 5;
	var fireRate : float = 0.1;
	var reloadTime : float = 3.0;
	var drawTime : float = 1.5;
	
	var range : float = 250.0;
	var force : float = 200.0;
	
	var inacuracy : float = 0.2;
	
	//Aiming
	var hipPosition : Vector3;
	var aimPosition : Vector3;
	private var aiming : boolean;
	private var curVect : Vector3;
	var aimSpeed : float = 0.25;
	
	//Field Of View
	var zoomSpeed : float = 0.5;
	var FOV : int = 40;
	
	private var bulletsLeft : int = 0;
	private var m_LastFrameShot : int = -10;
	private var nextFireTime : float = 0.0;
	private var reloading : boolean;
	private var draw : boolean;
	private var weaponCamera : GameObject;
	private var mainCamera : GameObject;
	private var playing : boolean = false;
	@HideInInspector
	var selected : boolean = false;
	//private var player : GameObject;
			
	//GUI
	var mySkin : GUISkin; 
	
	//KickBack
	var kickGO : Transform;
	var kickUpside : float = 0.5;
	var kickSideways : float = 0.5;
	
	//Crosshair Textures
	var crosshair : Texture2D;
	
function Start(){
    weaponCamera = GameObject.FindWithTag("WeaponCamera");
	mainCamera = GameObject.FindWithTag("MainCamera");
	//player = GameObject.FindWithTag("Player");
    muzzleFlash.enabled = false;
	muzzleLight.enabled = false;
	bulletsLeft = bulletsPerMag;
	aiming = false;
}	
	
function Update(){
	if(selected){
	
		if (Input.GetButtonDown ("Fire")){
			FireShotgun();
		}
		
		if (Input.GetButtonDown ("Reload")){
			Reload();
		}
	}	
	
	if (Input.GetButton("Fire2") && !Input.GetButton ("Run") && !reloading){		
		if (!aiming){
			aiming = true;
			curVect = aimPosition - transform.localPosition;
		}
		if (transform.localPosition != aimPosition && aiming){
			if(Mathf.Abs(Vector3.Distance(transform.localPosition , aimPosition)) < curVect.magnitude/aimSpeed * Time.deltaTime){
				transform.localPosition = aimPosition;
			} else {
				transform.localPosition += curVect/aimSpeed * Time.deltaTime;					
			}
		}
	} else {
		if (aiming){
			aiming = false;
			curVect = hipPosition-transform.localPosition;
			var go = GetComponentsInChildren(Renderer);
			for( var g : Renderer in go){
			if (g.name != "muzzle_flash")
				g.GetComponent.<Renderer>().enabled = true;
			}
		}
		
		if(Mathf.Abs(Vector3.Distance(transform.localPosition , hipPosition)) < curVect.magnitude/aimSpeed * Time.deltaTime){
			transform.localPosition = hipPosition;
		}else{
			transform.localPosition += curVect/aimSpeed * Time.deltaTime;
		}
	}
		
	if(aiming){
		mainCamera.GetComponent.<Camera>().fieldOfView -= FOV * Time.deltaTime/zoomSpeed;
		if(mainCamera.GetComponent.<Camera>().fieldOfView < FOV){
			mainCamera.GetComponent.<Camera>().fieldOfView = FOV;
		}
		weaponCamera.GetComponent.<Camera>().fieldOfView -= 40 * Time.deltaTime/zoomSpeed;
		if(weaponCamera.GetComponent.<Camera>().fieldOfView < 40){
			weaponCamera.GetComponent.<Camera>().fieldOfView = 40;
		}
			
	}else{
		mainCamera.GetComponent.<Camera>().fieldOfView += 60 * Time.deltaTime/0.5;
		if(mainCamera.GetComponent.<Camera>().fieldOfView > 60){
			mainCamera.GetComponent.<Camera>().fieldOfView = 60;
		}
		weaponCamera.GetComponent.<Camera>().fieldOfView += 50 * Time.deltaTime/0.5;
		if(weaponCamera.GetComponent.<Camera>().fieldOfView > 50){
			weaponCamera.GetComponent.<Camera>().fieldOfView = 50;
		}
	}
}

function LateUpdate(){
	if (m_LastFrameShot == Time.frameCount){
		muzzleFlash.transform.localRotation = Quaternion.AngleAxis(Random.value * 360, Vector3.forward);
		muzzleFlash.enabled = true;
		muzzleLight.enabled = true;		
    }else{
		muzzleFlash.enabled = false;
		muzzleLight.enabled = false;
	}	
}

function OnGUI (){
	if(selected){
		GUI.skin = mySkin;
		var style1 = mySkin.customStyles[0];
		
		
		GUI.Label (Rect(Screen.width - 200,Screen.height-35,200,80),"Ammo : ");
		GUI.Label (Rect(Screen.width - 110,Screen.height-35,200,80),"" + bulletsLeft, style1);
		GUI.Label (Rect(Screen.width - 80,Screen.height-35,200,80)," / " + magazines);	
		
		if(crosshair != null){	
			var w = crosshair.width/2;
			var h = crosshair.height/2;
			position = Rect((Screen.width - w)/2,(Screen.height - h )/2, w, h);
			if (!aiming) { 
				GUI.DrawTexture(position, crosshair);
			}
		}	
	}	
}


function FireShotgun (){
	if (reloading || bulletsLeft <= 0 || draw){
		if(bulletsLeft == 0){
			OutOfAmmo();
		}		
	    return;
	}
	
	var pellets : int = 0;
	
	if (Time.time - fireRate > nextFireTime)
		nextFireTime = Time.time - Time.deltaTime;
	if(Time.time > nextFireTime){
	    while (pellets < pelletsPerShot){
			FireOneShot();
		    pellets++;             
		}
		bulletsLeft--;
		nextFireTime = Time.time + fireRate;
		KickBack();
	}
}

function FireOneShot (){
	
    var direction = gameObject.transform.TransformDirection(Vector3(Random.Range(-0.01, 0.01) * inacuracy, Random.Range(-0.01, 0.01) * inacuracy,1));
	var hit : RaycastHit;
	var position = transform.parent.position;
	
	if (Physics.Raycast (position, direction, hit, range, layerMask.value)) {
	
	    var contact = hit.point;
		var rotation = Quaternion.FromToRotation(Vector3.up, hit.normal);
		
		if (hit.rigidbody){
			hit.rigidbody.AddForceAtPosition(force * direction, hit.point);
		}

		if (hit.transform.tag == "Untagged") {
			var default1 = Instantiate (untagged, contact, rotation) as GameObject;
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			default1.transform.parent = hit.transform;
		}
		
		if (hit.transform.tag == "Concrete") {
            var bulletHole = Instantiate (Concrete, contact, rotation) as GameObject;
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			bulletHole.transform.parent = hit.transform;
		}	
		
		if (hit.transform.tag == "Wood") {
            var woodHole = Instantiate (Wood, contact, rotation) as GameObject;
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			woodHole.transform.parent = hit.transform;
		}
		
		if (hit.transform.tag == "Metal") {
            var metalHole = Instantiate (Metal, contact, rotation) as GameObject;
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			metalHole.transform.parent = hit.transform;
		}
		
		
		if (hit.transform.tag == "Dirt") {
            var dirtHole = Instantiate (Dirt, contact, rotation) as GameObject;
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			dirtHole.transform.parent = hit.transform;
		}
		
		if (hit.transform.tag == "canBeUsed") {
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
		}	
		
		if (hit.transform.tag == "Enemy") {
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			
			yield WaitForSeconds(0.03);
			var bloodHole = Instantiate (Blood, contact, rotation) as GameObject;
			if(Physics.Raycast (position, direction, hit, range, layerMask.value)){
				if(hit.rigidbody){
					hit.rigidbody.AddForceAtPosition(force * direction, hit.point);
				}
			}	
		}
	}

	
	if (GetComponent.<AudioSource>()) {
		GetComponent.<AudioSource>().clip = soundFire;
		GetComponent.<AudioSource>().Play();
	}
	m_LastFrameShot = Time.frameCount;

	weaponAnim.GetComponent.<Animation>().Rewind("ShotgunFire");
	weaponAnim.GetComponent.<Animation>().Play("ShotgunFire");
}


function OutOfAmmo(){
	if(reloading || playing)
	return;
	
	playing = true;
	soundGO.GetComponent.<AudioSource>().clip = soundEmpty;
	soundGO.GetComponent.<AudioSource>().volume = 0.7;
	soundGO.GetComponent.<AudioSource>().Play();
	
	weaponAnim.GetComponent.<Animation>()["Fire"].speed = 2.0;
	weaponAnim.GetComponent.<Animation>().Play("Fire");
	yield WaitForSeconds(0.2);
	playing = false;
}


function Reload (){
	if(reloading)
	return;
	
	reloading = true;
	if (magazines > 0 && bulletsLeft < bulletsPerMag) {
		weaponAnim.GetComponent.<Animation>()["ShotgunReload"].speed = .8;
        weaponAnim.GetComponent.<Animation>().Play("ShotgunReload", PlayMode.StopAll);
	    weaponAnim.GetComponent.<Animation>().CrossFade("ShotgunReload");
        GetComponent.<AudioSource>().PlayOneShot(soundReload);
        yield WaitForSeconds(reloadTime);
		magazines --;
		magazines --;
		bulletsLeft = bulletsPerMag;
	}
	reloading = false;
}

function KickBack() {
    kickGO.localRotation = Quaternion.Euler(kickGO.localRotation.eulerAngles - Vector3(kickUpside, Random.Range(-kickSideways, kickSideways), 0));   
}

function DrawWeapon(){
	draw = true;
	GetComponent.<AudioSource>().clip = soundDraw;
	GetComponent.<AudioSource>().Play();
	weaponAnim.GetComponent.<Animation>().Play("Draw", PlayMode.StopAll);
	weaponAnim.GetComponent.<Animation>().CrossFade("Draw");
	yield WaitForSeconds(drawTime);
	draw = false;
	reloading = false;
	selected = true;
}

function Deselect(){
	selected = false;
	mainCamera.GetComponent.<Camera>().fieldOfView = 60;
	weaponCamera.GetComponent.<Camera>().fieldOfView = 50;
	transform.localPosition = hipPosition;
}