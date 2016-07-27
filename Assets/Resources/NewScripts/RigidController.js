/**
*  Script written by OMA [www.armedunity.com]
**/
var proneSpeed = 1.0;
var crouchSpeed = 2.0;
var walkSpeed = 8.0;
var runSpeed = 20.0;
var runSkillLevel : float = 0.0;
var gravitySkillLevel : float = 0.0;

var fallDamageMultiplier : int = 2;
var fallAnimGO : GameObject;
var inAirControl = 0.1;
var gravity = 20.0;
var maxVelocityChange = 10.0;
var canJump = true;
var jumpHeight = 2.0;
var fallSound : AudioClip;
var playerWeapons : GameObject;
//@HideInInspector
var grounded = false;
private var sliding : boolean = false;
private var speed = 10.0;
private var limitDiagonalSpeed = true;
private var normalHeight : float = 0.5;
private var crouchHeight : float = -0.2;
private var crouchingHeight = 0.3;
var proneHeight : float = -0.7;
private var hit : RaycastHit;
private var myTransform : Transform;
private var rayDistance : float;
private var mainCameraGO : GameObject;
private var weaponCameraGO : GameObject;
var state : int = 0;
var moveSpeed : float = 2.0;
var targetVelocity : Vector3 = Vector3.zero;
var onLadder : boolean = false;
var climbSpeed : float = 10.0;
var canClimb : boolean = false;

@script RequireComponent(Rigidbody, CapsuleCollider)

function Awake (){
    GetComponent.<Rigidbody>().freezeRotation = true;
    GetComponent.<Rigidbody>().useGravity = false;
	myTransform = transform;
	mainCameraGO = gameObject.FindWithTag("MainCamera");
	weaponCameraGO = gameObject.FindWithTag("WeaponCamera");
	rayDistance = GetComponent.<Collider>().height * .5 + GetComponent.<Collider>().radius;
	playerWeapons.GetComponent.<Animation>().wrapMode = WrapMode.Loop;
}

function FixedUpdate (){
		var inputX = Input.GetAxis("Horizontal");
		var inputY = Input.GetAxis("Vertical");
		var inputModifyFactor = (inputX != 0.0 && inputY != 0.0 && limitDiagonalSpeed)? .7071 : 1.0;

    if (grounded){			
		
		
		if(state == 0){
			if ( Physics.Raycast(myTransform.position, -Vector3.up, hit, rayDistance)) {
				if (Vector3.Angle(hit.normal, Vector3.up) > 30){
					sliding = true;
					GetComponent.<Rigidbody>().AddRelativeForce (-Vector3.up * 500);
				}else{
					sliding = false;
					
				}	
			}
		}	

        // Calculate how fast we should be moving
        targetVelocity = new Vector3(inputX * inputModifyFactor, 0.0, inputY * inputModifyFactor);
        targetVelocity = myTransform.TransformDirection(targetVelocity);
        targetVelocity *= speed;	
		
        // Apply a force that attempts to reach our target velocity
        var velocity = GetComponent.<Rigidbody>().velocity;
        var velocityChange = (targetVelocity - velocity);
        velocityChange.x = Mathf.Clamp(velocityChange.x, -maxVelocityChange, maxVelocityChange);
        velocityChange.z = Mathf.Clamp(velocityChange.z, -maxVelocityChange, maxVelocityChange);
		velocityChange.y = 0.0;
        GetComponent.<Rigidbody>().AddForce(velocityChange, ForceMode.VelocityChange);
   
        
        if (canJump && Input.GetButtonDown("Jump") && state == 0){
			GetComponent.<Rigidbody>().velocity = Vector3(velocity.x, CalculateJumpVerticalSpeed(), velocity.z);
        }
		
		if(Input.GetButton("Use") && onLadder){
			canClimb = true;
			GetComponent.<Rigidbody>().velocity = Vector3(velocity.x, CalculateJumpVerticalSpeed(), velocity.z);
		}
		
		if(state == 0){
            if (grounded && Input.GetButton("Run") && Input.GetKey("w")){
				speed = runSpeed + runSkillLevel;
			}else{ 
			    speed = walkSpeed;
			}
		}else if(state == 1){
			speed = crouchSpeed;
		}else if(state == 2){
			speed = proneSpeed;
		}	
	
	}else{

		if(onLadder && canClimb){
			//if(Input.GetAxis("Vertical")){
         
			targetVelocity = new Vector3(0.0, Input.GetAxis("Vertical") * inputModifyFactor, 0.0 );
			targetVelocity *= climbSpeed;
			targetVelocity = myTransform.TransformDirection(targetVelocity);
			
			var velChange = (targetVelocity - GetComponent.<Rigidbody>().velocity);
			velChange.x = Mathf.Clamp(velChange.x, -maxVelocityChange, maxVelocityChange);
			velChange.y = Mathf.Clamp(velChange.y, -maxVelocityChange, maxVelocityChange);
			velChange.z = 0.0;
			
			GetComponent.<Rigidbody>().AddForce(velChange, ForceMode.VelocityChange);
			//}
			/*
			// Calculate how fast we should be moving
			targetVelocity = new Vector3(inputX * inputModifyFactor, inputY * inputModifyFactor, 0.0);
			targetVelocity = myTransform.TransformDirection(targetVelocity);
			targetVelocity *= climbSpeed;
			
			// Apply a force that attempts to reach our target velocity
			var velChange = (targetVelocity - rigidbody.velocity);
			velChange.x = Mathf.Clamp(velChange.x, -maxVelocityChange, maxVelocityChange);
			velChange.y = Mathf.Clamp(velChange.y, -maxVelocityChange, maxVelocityChange);
			velChange.z = 0.0;
			rigidbody.AddForce(velChange, ForceMode.VelocityChange);
			*/
		}else{
			// AirControl 
			targetVelocity = new Vector3(Input.GetAxis("Horizontal"), 0.0, Input.GetAxis("Vertical"));
			targetVelocity = transform.TransformDirection(targetVelocity) * inAirControl;
			GetComponent.<Rigidbody>().AddForce(targetVelocity, ForceMode.VelocityChange);
		}
	} 
	
	if(onLadder == false){
		canClimb = false;
	}
	
	if(canClimb == false){
		// Gravity 
		GetComponent.<Rigidbody>().AddForce(Vector3 (0, (-gravity + gravitySkillLevel) * GetComponent.<Rigidbody>().mass, 0));
	}
	
	grounded = false;
	onLadder = false;
}

function OnCollisionStay (col : Collision){
	
	for(var contact : ContactPoint in col.contacts){
		if(Vector3.Angle(contact.normal, Vector3.up) < 45){
			grounded = true;
		}       
	}
}

function OnTriggerStay(other : Collider){
	if (other.gameObject.tag == "Ladder") {
		onLadder = true;
		grounded = false;
	}
}

function HitJumpPad(velocity : float) {
    GetComponent.<Rigidbody>().velocity.z += velocity;
}

function OnCollisionEnter (collision : Collision){
    if(grounded == false){
		fallAnimGO.GetComponent.<Animation>().CrossFadeQueued("Fall", 0.3, QueueMode.PlayNow);
		var currSpeed : float = collision.relativeVelocity.magnitude;
		
		if (currSpeed > 25) {
			var damage : float = currSpeed * fallDamageMultiplier;
			Debug.Log ("FallDamage" + damage);
			SendMessage ("PlayerDamage", damage, SendMessageOptions.DontRequireReceiver);
		}	
	}	
}

function CalculateJumpVerticalSpeed (){
    return Mathf.Sqrt(2 * jumpHeight * gravity);
}

function Update(){
	if(grounded){
		if ( GetComponent.<Rigidbody>().velocity.magnitude < (walkSpeed+2) && GetComponent.<Rigidbody>().velocity.magnitude > (walkSpeed-2) && !Input.GetButton("Fire2")){
			playerWeapons.GetComponent.<Animation>().CrossFade("Walk");
			
		}else if (GetComponent.<Rigidbody>().velocity.magnitude > (runSpeed -2)){
			playerWeapons.GetComponent.<Animation>().CrossFade("Run");
			
		}else if (GetComponent.<Rigidbody>().velocity.magnitude < (crouchSpeed+1) && GetComponent.<Rigidbody>().velocity.magnitude > (crouchSpeed-1) && Input.GetButton("Fire2")){
			playerWeapons.GetComponent.<Animation>().CrossFade("CrouchAim");
		
		}else{
			playerWeapons.GetComponent.<Animation>().CrossFade("IdleAnim");
		}	
	}else{
		playerWeapons.GetComponent.<Animation>().CrossFade("IdleAnim");
	}	
	
	if(mainCameraGO.transform.localPosition.y > normalHeight){
		mainCameraGO.transform.localPosition.y = normalHeight;
	} else if(mainCameraGO.transform.localPosition.y < proneHeight){
		mainCameraGO.transform.localPosition.y = proneHeight;
	}	
	
	weaponCameraGO.transform.localPosition.y = mainCameraGO.transform.localPosition.y;	

	
	if (Input.GetButtonDown("Crouch")) {
		if(state == 0 || state == 2){
			state = 1;
		} else if(state == 1){
			state = 0;
		}	
	} 
	


	if(state == 0){ //Stand Position
		GetComponent.<Collider>().direction = 1;
		GetComponent.<Collider>().height = 2.0;
		GetComponent.<Collider>().center = Vector3 (0, 0, 0);
		if(mainCameraGO.transform.localPosition.y < normalHeight){
			mainCameraGO.transform.localPosition.y += Time.deltaTime * moveSpeed;
		}

		
		
	}else if(state == 1){ //Crouch Position
		GetComponent.<Collider>().direction = 1;
		GetComponent.<Collider>().height = 1.5;
		GetComponent.<Collider>().center = Vector3 (0, -0.25, 0);
		if(mainCameraGO.transform.localPosition.y > crouchHeight){
			if(mainCameraGO.transform.localPosition.y - (crouchingHeight * Time.deltaTime/.1) < crouchHeight){
				mainCameraGO.transform.localPosition.y = crouchHeight;
			} else {
				mainCameraGO.transform.localPosition.y -= crouchingHeight * Time.deltaTime/.1;
			}
		}
		
		if(mainCameraGO.transform.localPosition.y < crouchHeight){
			if(mainCameraGO.transform.localPosition.y - (crouchingHeight * Time.deltaTime/.1) > crouchHeight){
				mainCameraGO.transform.localPosition.y = crouchHeight;
			} else {
				mainCameraGO.transform.localPosition.y += crouchingHeight * Time.deltaTime/.1;
			}
		}
		
		if (Input.GetButtonDown("Jump")){
			state = 0;	
		}
		
	} else 	if(state == 2){ //Prone Position
		GetComponent.<Collider>().direction = 2;
		GetComponent.<Collider>().height = 0.5;
		GetComponent.<Collider>().center = Vector3 (0, -0.5, 0);
		if(mainCameraGO.transform.localPosition.y > proneHeight){
			mainCameraGO.transform.localPosition.y += proneHeight * Time.deltaTime * (moveSpeed + GetComponent.<Rigidbody>().velocity.magnitude);
		}
		
		
		if (Input.GetButtonDown("Jump")){
			state = 1;	
		}
	}	
	
	if (Input.GetButtonDown("GoProne")){
		if(state == 0 || state == 1){
			state = 2;
		} else if(state == 2){ 
			state = 0;
		}	
	}
}

function Accelerate (accelerateY : float, accelerateZ : float){
    grounded = false;
	GetComponent.<Rigidbody>().AddRelativeForce (0, accelerateY, accelerateZ);	
}

function OnGUI(){
	if(onLadder && !canClimb)
	GUI.Label(Rect(Screen.width - (Screen.width/1.7),Screen.height - (Screen.height/1.4),800,100),"Press key >>E<< to Climb");
}