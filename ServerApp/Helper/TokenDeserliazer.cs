// ReSharper disable InconsistentNaming
// ReSharper disable ClassNeverInstantiated.Global
// ReSharper disable UnusedMember.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
namespace ServerApp.Helper;

// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);

public class AppMetadata
{
    public string provider { get; set; }
    public List<string> providers { get; set; }
}

public class Identity
{
    public string identity_id { get; set; }
    public string id { get; set; }
    public string user_id { get; set; }
    public IdentityData identity_data { get; set; }
    public string provider { get; set; }
    public DateTime last_sign_in_at { get; set; }
    public DateTime created_at { get; set; }
    public DateTime updated_at { get; set; }
    public string email { get; set; }
}

public class IdentityData
{
    public string email { get; set; }
    public bool email_verified { get; set; }
    public bool phone_verified { get; set; }
    public string sub { get; set; }
}

public class JwtToken
{
    public string access_token { get; set; }
    public string token_type { get; set; }
    public int expires_in { get; set; }
    public int expires_at { get; set; }
    public string refresh_token { get; set; }
    public User user { get; set; }
    public WeakPassword weak_password { get; set; }
}

public class User
{
    public string id { get; set; }
    public string aud { get; set; }
    public string role { get; set; }
    public string email { get; set; }
    public DateTime email_confirmed_at { get; set; }
    public string phone { get; set; }
    public DateTime confirmed_at { get; set; }
    public string last_sign_in_at { get; set; }
    public AppMetadata app_metadata { get; set; }
    public UserMetadata user_metadata { get; set; }
    public List<Identity> identities { get; set; }
    public DateTime created_at { get; set; }
    public DateTime updated_at { get; set; }
    public bool is_anonymous { get; set; }
}

public class UserMetadata;

public class WeakPassword
{
    public string message { get; set; }
    public List<string> reasons { get; set; }
}
    