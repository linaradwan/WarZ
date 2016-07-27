using UnityEngine;
using System.Collections;

public class BoostMovement : MonoBehaviour {
	public float speed = 6; 
	public float jumpSpeed= 8;
	public float gravity= 20;
	public float boostForce= 20;
	public bool usedBoost= false;
	public bool isGrounded= true;
	public float groundDashForce = 8; 
	public float airDashForce= 16;
	public float mass= 1;
	public float dashTimer= 0;
	public float dashDelay= 1f;

	private Vector3 impact = Vector3.zero;
	private Vector3 moveDirection = Vector3.zero;

	CharacterController controller ;

	// Use this for initialization
	void Awake () {
		 controller = GetComponent<CharacterController>();
		Screen.lockCursor = true;

	}
	
	// Update is called once per frame
	void Update() {
		CollisionFlags flags = controller.Move (moveDirection * Time.deltaTime);
		isGrounded = (flags & CollisionFlags.CollidedBelow)!=0;

		if (isGrounded) {
			moveDirection = new Vector3( Input.GetAxis("Horizantal"),0, Input.GetAxis("Vertical"));
			moveDirection = transform.TransformDirection (moveDirection);
			moveDirection *= speed; 

			if(Input.GetKeyDown("space"))
				moveDirection.y=jumpSpeed;
			
				}
				else if (!isGrounded && !usedBoost){


					if(Input.GetKeyDown("space"))
						Boost();
					
				
				}

		if(Input.GetKeyDown("left shift")&& dashTimer<=0){

			Dash();
		}

		if (impact.magnitude > 0.2F) {

			controller.Move (impact * Time.deltaTime);
		}
		impact = Vector3.Lerp (impact, Vector3.zero, 5 * Time.deltaTime);

				moveDirection.y -= gravity*Time.deltaTime;
		if (dashTimer > 0)
			dashTimer -= Time.deltaTime;
		
	
	}

				void Boost(){
		moveDirection.y = boostForce;
		usedBoost = true;

				}

						void Dash(){
		if(!isGrounded || (isGrounded && (Input.GetKey(KeyCode.A) ||Input.GetKey(KeyCode.S) ||Input.GetKey(KeyCode.D)))){

			moveDirection = new Vector3 (Input.GetAxis ("Horizantal"), 0, Input.GetAxis ("Vertical"));
			moveDirection = transform.TransformDirection (moveDirection);

			AddImpact (new Vector3 (moveDirection.x, 0, moveDirection.z), (isGrounded ? groundDashForce : airDashForce));
			dashTimer = dashDelay;
		}
						}



						public 	void AddImpact( Vector3 dir, float force){

		dir.Normalize ();
								if(dir.y<0){
									dir.y= -dir.y;
								}
		impact += dir.normalized * force / mass;


						}
}
