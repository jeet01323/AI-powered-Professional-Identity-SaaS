const genAI = require("../../config/gemini");

const Profile = require("../../models/Profile");


// Generate AI Bio
const generateBio = async (req, res) => {
  try {

    const {
      role,
      skills,
      experience,
    } = req.body;


    // Gemini Model
    const model =
      genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      });


    // Prompt
    const prompt = `
    Write a professional developer bio.

    Role: ${role}

    Skills: ${skills}

    Experience: ${experience}

    Keep it professional, concise, and modern.
    `;


    // Generate AI Response
    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();


    // Save Bio into Profile
    const profile = await Profile.findOne({
      userId: req.user.id,
    });

    if (profile) {
      profile.bio = response;

      await profile.save();
    }


    res.json({
      bio: response,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// AI PORTFOLIO REVIEW
const reviewPortfolio = async (
  req,
  res
) => {
  try {

    // FIND PROFILE
    const profile =
      await Profile.findOne({
        userId: req.user.id,
      });


    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }


    // CREATE PROMPT
    const prompt = `
You are an expert software engineering recruiter and portfolio reviewer.

Analyze this developer portfolio.

Profile Data:
Name: ${profile.displayName}

Designation: ${profile.designation}

Bio: ${profile.bio}

Skills:
${profile.skills
  .map((s) => s.name)
  .join(", ")}

Projects:
${profile.projects
  .map(
    (p) =>
      `${p.title}: ${p.description}`
  )
  .join("\n")}

GitHub Username:
${profile.githubData?.username}

Provide:
1. Portfolio score out of 100
2. Strengths
3. Weaknesses
4. Career improvement suggestions
5. Missing technologies
6. Resume improvement suggestions

Give response in clean JSON format.
`;


    // GEMINI MODEL
    const model =
      genAI.getGenerativeModel({
        model:
          "gemini-2.5-flash",
      });


    // GENERATE RESPONSE
    const result =
      await model.generateContent(
        prompt
      );


    const response =
      result.response.text();


    res.json({
      review: response,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  generateBio,
  reviewPortfolio,
};

