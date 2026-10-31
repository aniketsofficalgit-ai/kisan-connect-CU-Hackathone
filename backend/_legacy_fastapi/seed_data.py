import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models import (
    User, WorkerProfile, MachineryListing, CropListing,
    WorkerRequest, MachineryBooking, BuyerInquiry,
    Conversation, Message, Notification, Review
)
from app.auth import hash_password

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).first():
            print("Database already contains data. Skipping seeding.")
            return

        print("Seeding initial demo data for Kisan Connect...")

        default_password_hash = hash_password("password123")

        # 1. Demo Core Users
        farmer_user = User(
            full_name="Gurpreet Singh",
            mobile_number="9876543210",
            email="farmer@kisanconnect.in",
            hashed_password=default_password_hash,
            role="farmer",
            village="Sahnewal",
            town="Khanna",
            district="Ludhiana",
            state="Punjab",
            preferred_language="pa",
            verification_status="verified",
            verification_notes="Verified via Kisan Credit Card and Land Record 7/12.",
            bio="Cultivating 18 acres of Wheat, Basmati Rice, and Mustard using sustainable practices."
        )

        worker_user = User(
            full_name="Ramesh Kumar",
            mobile_number="9876543211",
            email="worker@kisanconnect.in",
            hashed_password=default_password_hash,
            role="worker",
            village="Baddowal",
            town="Ludhiana",
            district="Ludhiana",
            state="Punjab",
            preferred_language="hi",
            verification_status="verified",
            verification_notes="Aadhaar ID verified. Police cleared.",
            bio="Lead agricultural labor team with 8+ years experience in wheat harvesting, paddy transplantation, and tractor driving."
        )

        machinery_user = User(
            full_name="Balwinder Dhillon",
            mobile_number="9876543212",
            email="owner@kisanconnect.in",
            hashed_password=default_password_hash,
            role="machinery_owner",
            village="Dehlon",
            town="Ludhiana",
            district="Ludhiana",
            state="Punjab",
            preferred_language="pa",
            verification_status="verified",
            verification_notes="Commercial tractor registration verified.",
            bio="Owner of agricultural machinery fleet. Serving farmers across Ludhiana and Sangrur districts with modern well-maintained implements."
        )

        buyer_user = User(
            full_name="Priya Aggarwal",
            mobile_number="9876543213",
            email="buyer@kisanconnect.in",
            hashed_password=default_password_hash,
            role="buyer",
            village="",
            town="Karnal City",
            district="Karnal",
            state="Haryana",
            preferred_language="en",
            verification_status="verified",
            verification_notes="FSSAI & GST registered agricultural wholesale enterprise.",
            bio="Procurement Manager at Aggarwal Agro Exports. Sourcing premium grains and oilseeds directly from verified farmer clusters."
        )

        admin_user = User(
            full_name="Kisan Connect Administrator",
            mobile_number="9876543214",
            email="admin@kisanconnect.in",
            hashed_password=default_password_hash,
            role="admin",
            village="",
            town="Central Office",
            district="Ludhiana",
            state="Punjab",
            preferred_language="en",
            verification_status="verified",
            verification_notes="System Superadmin account",
            bio="Official Kisan Connect platform administrator."
        )

        # Additional worker accounts for realistic discovery
        worker_user2 = User(
            full_name="Sukhdev Verma",
            mobile_number="9876543215",
            email="sukhdev@kisanconnect.in",
            hashed_password=default_password_hash,
            role="worker",
            village="Jagraon",
            town="Jagraon",
            district="Ludhiana",
            state="Punjab",
            preferred_language="pa",
            verification_status="verified",
            bio="Specialist in drip irrigation setup, orchard pruning, and precision pesticide spraying."
        )

        worker_user3 = User(
            full_name="Mohan Lal Yadav",
            mobile_number="9876543216",
            email="mohan@kisanconnect.in",
            hashed_password=default_password_hash,
            role="worker",
            village="Samrala",
            town="Samrala",
            district="Ludhiana",
            state="Punjab",
            preferred_language="hi",
            verification_status="pending",
            bio="Seasonal farm labor group coordinator (5 skilled farmhands available)."
        )

        db.add_all([farmer_user, worker_user, machinery_user, buyer_user, admin_user, worker_user2, worker_user3])
        db.commit()

        # 2. Worker Profiles
        wp1 = WorkerProfile(
            user_id=worker_user.id,
            skills="Harvesting, Tractor Driving, Sowing, Paddy Transplantation",
            experience_years=8,
            expected_wage=600.0,
            wage_unit="per_day",
            is_group=True,
            group_size=4,
            preferred_work_area="Ludhiana, Doraha, Khanna",
            is_available=True,
            rating_average=4.8,
            review_count=12,
            completed_jobs_count=34
        )

        wp2 = WorkerProfile(
            user_id=worker_user2.id,
            skills="Spraying, Drip Irrigation, Pruning, Tilling",
            experience_years=5,
            expected_wage=550.0,
            wage_unit="per_day",
            is_group=False,
            group_size=1,
            preferred_work_area="Ludhiana, Jagraon, Moga",
            is_available=True,
            rating_average=4.9,
            review_count=8,
            completed_jobs_count=19
        )

        wp3 = WorkerProfile(
            user_id=worker_user3.id,
            skills="Weeding, Harvesting, Threshing, Manual Labor",
            experience_years=4,
            expected_wage=500.0,
            wage_unit="per_day",
            is_group=True,
            group_size=6,
            preferred_work_area="Samrala, Khanna",
            is_available=True,
            rating_average=4.6,
            review_count=5,
            completed_jobs_count=14
        )

        db.add_all([wp1, wp2, wp3])
        db.commit()

        # 3. Machinery Listings
        machinery_items = [
            MachineryListing(
                owner_id=machinery_user.id,
                title="Mahindra 575 DI XP Plus Tractor (47 HP)",
                category="Tractors",
                make_model="Mahindra 575 DI",
                horse_power="47 HP",
                rental_price=750.0,
                pricing_unit="per_hour",
                location_village="Dehlon",
                location_district="Ludhiana",
                location_state="Punjab",
                description="Heavy duty 4-cylinder tractor with power steering and dual clutch. Equipped for cultivation, ploughing, and haulage.",
                specifications="Diesel, 4-wheel drive, includes PTO shaft and top link attachment.",
                image_url="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
                is_available=True,
                includes_operator=True,
                includes_fuel=False,
                maintenance_status="operational"
            ),
            MachineryListing(
                owner_id=machinery_user.id,
                title="Preet 987 Self-Propelled Combine Harvester",
                category="Harvesters",
                make_model="Preet 987",
                horse_power="101 HP",
                rental_price=2200.0,
                pricing_unit="per_hour",
                location_village="Dehlon",
                location_district="Ludhiana",
                location_state="Punjab",
                description="High output combine harvester suitable for wheat, paddy, soybean, and mustard with minimal grain loss.",
                specifications="14 ft cutter bar, straw reaper attachment available upon request.",
                image_url="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
                is_available=True,
                includes_operator=True,
                includes_fuel=True,
                maintenance_status="operational"
            ),
            MachineryListing(
                owner_id=machinery_user.id,
                title="Fieldking Heavy Duty 9-Tyne Cultivator",
                category="Cultivators",
                make_model="Fieldking FKHC9",
                horse_power="Suitable for 35-55 HP",
                rental_price=1200.0,
                pricing_unit="per_day",
                location_village="Dehlon",
                location_district="Ludhiana",
                location_state="Punjab",
                description="Spring-loaded 9-tine tiller for deep seedbed preparation and weed uprooting.",
                specifications="Heavy channel frame, reversible forged shovel points.",
                image_url="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
                is_available=True,
                includes_operator=False,
                includes_fuel=False,
                maintenance_status="operational"
            ),
            MachineryListing(
                owner_id=machinery_user.id,
                title="Shaktiman Rotary Tiller (Rotavator) 7 Feet",
                category="Cultivators",
                make_model="Shaktiman Regular Plus",
                horse_power="Requires 50+ HP",
                rental_price=800.0,
                pricing_unit="per_hour",
                location_village="Sahnewal",
                location_district="Ludhiana",
                location_state="Punjab",
                description="High performance 7-foot rotavator with boron steel blades. Delivers smooth soil pulverization in a single pass.",
                specifications="54 L-type blades, multi-speed gearbox.",
                image_url="https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80",
                is_available=True,
                includes_operator=True,
                includes_fuel=False,
                maintenance_status="operational"
            ),
            MachineryListing(
                owner_id=machinery_user.id,
                title="Solar Powered Drip Irrigation Unit (5 HP Pump)",
                category="Irrigation Equipment",
                make_model="Shakti Solar 5HP",
                horse_power="5 HP",
                rental_price=1800.0,
                pricing_unit="per_day",
                location_village="Khanna",
                location_district="Ludhiana",
                location_state="Punjab",
                description="Portable solar pump set with filtration unit for efficient micro-irrigation.",
                specifications="Submersible pump with 16 solar PV panels and auto-controller.",
                image_url="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
                is_available=True,
                includes_operator=False,
                includes_fuel=False,
                maintenance_status="operational"
            )
        ]
        db.add_all(machinery_items)
        db.commit()

        # 4. Crop Listings
        crop_items = [
            CropListing(
                farmer_id=farmer_user.id,
                crop_name="Sharbati Wheat",
                category="Grains",
                variety="HD 3086 (Pusa Gautami)",
                available_quantity=120.0,
                quantity_unit="quintal",
                asking_price=2450.0,
                price_unit="per_quintal",
                harvest_date="April 2026",
                quality_grade="Grade A",
                village="Sahnewal",
                district="Ludhiana",
                state="Punjab",
                description="Clean, golden-grain premium Sharbati wheat grown with balanced bio-fertilizers. Moisture content below 11.5%. Ideal for premium flour milling.",
                image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
                preferred_contact_method="either",
                status="available"
            ),
            CropListing(
                farmer_id=farmer_user.id,
                crop_name="Basmati Rice 1121",
                category="Grains",
                variety="Pusa 1121 Traditional",
                available_quantity=85.0,
                quantity_unit="quintal",
                asking_price=3850.0,
                price_unit="per_quintal",
                harvest_date="November 2026",
                quality_grade="Grade A",
                village="Sahnewal",
                district="Ludhiana",
                state="Punjab",
                description="Extra-long grain Basmati rice paddy. Highly aromatic, uniform grain length, harvested carefully to avoid breakage.",
                image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
                preferred_contact_method="phone",
                status="available"
            ),
            CropListing(
                farmer_id=farmer_user.id,
                crop_name="Yellow Mustard (Pili Sarson)",
                category="Oilseeds",
                variety="Giriraj (DRMRIJ-31)",
                available_quantity=40.0,
                quantity_unit="quintal",
                asking_price=5400.0,
                price_unit="per_quintal",
                harvest_date="March 2026",
                quality_grade="Grade A",
                village="Sahnewal",
                district="Ludhiana",
                state="Punjab",
                description="Bold seed yellow mustard with oil content exceeding 41.5%. Naturally sun-dried and screened.",
                image_url="https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
                preferred_contact_method="chat",
                status="available"
            )
        ]
        db.add_all(crop_items)
        db.commit()

        # 5. Worker Request Sample
        wr1 = WorkerRequest(
            farmer_id=farmer_user.id,
            worker_id=worker_user.id,
            work_type="Wheat Harvesting & Stacking",
            start_date="2026-11-05",
            end_date="2026-11-08",
            duration_days=3,
            workers_count=4,
            location="Sahnewal Field Block #3, Ludhiana",
            proposed_wage=600.0,
            wage_unit="per_day",
            total_estimated_amount=7200.0,
            notes="Please bring sickles and tying ropes. Drinking water and midday refreshments will be provided.",
            status="accepted",
            response_note="Accepted. Our 4-member team will arrive at 7:30 AM sharp."
        )
        db.add(wr1)

        # 6. Machinery Booking Sample
        mb1 = MachineryBooking(
            farmer_id=farmer_user.id,
            machinery_id=machinery_items[0].id,
            start_date="2026-11-02",
            end_date="2026-11-02",
            rental_units=6.0,
            unit_type="hours",
            estimated_amount=4500.0,
            delivery_needed=False,
            delivery_address="Sahnewal Main Road, Gate 2",
            notes="Required for deep field ploughing before rabi sowing.",
            status="approved",
            owner_response_note="Confirmed. Tractor and operator will arrive at 8:00 AM."
        )
        db.add(mb1)

        # 7. Buyer Inquiry Sample
        bi1 = BuyerInquiry(
            buyer_id=buyer_user.id,
            crop_id=crop_items[0].id,
            requested_quantity=50.0,
            quantity_unit="quintal",
            proposed_price=2400.0,
            price_unit="per_quintal",
            total_proposed_amount=120000.0,
            message="Aggarwal Agro is interested in lifting 50 quintals of your Sharbati Wheat. Can you arrange bagging in 50kg standard jute gunny bags?",
            delivery_preference="buyer_pickup",
            status="pending"
        )
        db.add(bi1)
        db.commit()

        # 8. Sample Conversation & Messages
        conv1 = Conversation(
            participant1_id=farmer_user.id,
            participant2_id=buyer_user.id,
            subject="Re: Sharbati Wheat Procurement (50 Quintals)",
            context_type="crop_inquiry",
            context_id=bi1.id,
            last_message_at=datetime.datetime.utcnow()
        )
        db.add(conv1)
        db.commit()

        msg1 = Message(
            conversation_id=conv1.id,
            sender_id=buyer_user.id,
            content="Hello Sardar Gurpreet Singh ji, we reviewed your Sharbati Wheat listing. We can purchase 50 quintals at ₹2,400 per quintal with immediate bank transfer upon weighing.",
            is_read=True,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=4)
        )
        msg2 = Message(
            conversation_id=conv1.id,
            sender_id=farmer_user.id,
            content="Sat Sri Akal Priya ji. The grain is clean and well dried. I can accept ₹2,425 per quintal if your truck picks it up from our farm gate.",
            is_read=False,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        )
        db.add_all([msg1, msg2])

        # 9. Initial Notifications
        notifs = [
            Notification(
                user_id=farmer_user.id,
                title="Booking Approved: Mahindra 575 DI Tractor",
                message="Balwinder Dhillon approved your tractor booking for 2026-11-02.",
                notification_type="machinery_booking",
                reference_id=mb1.id,
                reference_type="machinery_booking",
                is_read=False
            ),
            Notification(
                user_id=farmer_user.id,
                title="New Purchase Offer Received",
                message="Priya Aggarwal submitted a purchase inquiry for 50 Quintals of Sharbati Wheat.",
                notification_type="crop_inquiry",
                reference_id=bi1.id,
                reference_type="crop_inquiry",
                is_read=False
            ),
            Notification(
                user_id=worker_user.id,
                title="New Job Request Accepted",
                message="You accepted a 3-day harvesting request from Gurpreet Singh.",
                notification_type="worker_request",
                reference_id=wr1.id,
                reference_type="worker_request",
                is_read=True
            )
        ]
        db.add_all(notifs)

        # 10. Sample Review
        review1 = Review(
            reviewer_id=farmer_user.id,
            reviewee_id=worker_user.id,
            context_type="worker",
            context_id=wr1.id,
            rating=5,
            comment="Ramesh and his team did excellent work during wheat harvesting. Punctual, disciplined, and very hardworking!"
        )
        db.add(review1)

        db.commit()
        print("Kisan Connect sample demo database initialized successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during database seed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
