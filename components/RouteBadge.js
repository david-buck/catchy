export default function RouteBadge({
  route_type,
  route_color,
  service_id,
  className,
}) {
  return (
    <div
      style={
        (route_type === "frequent" && {
          background: route_color,
          color: "white",
        }) ||
        (route_type === "standard" && {
          background: "white",
          border: "1px solid ",
          color: route_color,
        }) ||
        (route_type === "night" && {
          background: "rgba(0,0,0,0.8)",
          boxShadow: "-.4rem 0 0 0 currentColor inset",
          color: "#FFF200",
          fontSize: "0.875rem ",
          letterSpacing: "-0.05em",
          paddingRight: ".5rem",
        }) ||
        (route_type === "school" && {
          background: "#FAFF00",
          color: "rgba(0,0,0,.8)",
        })
      }
      className={
        className +
        " grid place-items-center w-9 h-9 font-semibold rounded-full flex-shrink-0"
      }
    >
      {service_id}
    </div>
  );
}
